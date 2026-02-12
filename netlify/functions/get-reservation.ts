import { Handler } from '@netlify/functions';
import { tokenCache } from './lib/token-cache';

const CACHE_KEY = 'guesty_access_token';

// Get Guesty access token (with caching to prevent rate limiting)
async function getGuestyAccessToken(): Promise<string> {
    // Check cache first
    const cachedToken = tokenCache.get(CACHE_KEY);
    if (cachedToken) {
        console.log('Using cached Guesty token');
        return cachedToken;
    }

    // No cached token, fetch a new one
    console.log('Fetching new Guesty token...');

    const clientId = process.env.GUESTY_CLIENT_ID;
    const clientSecret = process.env.GUESTY_CLIENT_SECRET;

    console.log('Client ID exists:', !!clientId);
    console.log('Client Secret exists:', !!clientSecret);

    if (!clientId || !clientSecret) {
        throw new Error('Guesty credentials not configured');
    }

    const response = await fetch('https://open-api.guesty.com/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: clientId,
            client_secret: clientSecret,
            scope: 'open-api',
        }),
    });

    console.log('Guesty auth response status:', response.status);

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Guesty auth error response:', errorText);
        throw new Error('Failed to authenticate with Guesty');
    }

    const data = await response.json();
    console.log('Successfully authenticated with Guesty');

    // Cache the token (Guesty tokens typically expire in 3600 seconds / 1 hour)
    const expiresIn = data.expires_in || 3600;
    tokenCache.set(CACHE_KEY, data.access_token, expiresIn);
    console.log(`Token cached for ${expiresIn} seconds`);

    return data.access_token;
}

// Get reservation from Guesty by MongoDB ID (direct lookup)
async function getReservationById(reservationId: string, accessToken: string) {
    const response = await fetch(`https://api.guesty.com/v1/reservations/${reservationId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Guesty API error (ID lookup): ${response.status}`, errorText);
        throw new Error(`Failed to fetch reservation by ID: ${response.status}`);
    }

    const reservation = await response.json();
    console.log(`Fetched reservation by ID: ${reservation._id} for guest ${reservation.guest?.fullName}`);
    return reservation;
}

// Get reservation from Guesty by confirmation code
async function getReservationByConfirmationCode(confirmationCode: string, accessToken: string) {
    console.log('Searching for reservation with confirmation code:', confirmationCode);

    // Use the list endpoint with filter by confirmation code
    const response = await fetch(`https://open-api.guesty.com/v1/reservations?confirmationCode=${confirmationCode}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });

    console.log('Guesty API response status:', response.status);

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Guesty API error response:', errorText);
        throw new Error(`Failed to search reservations (Status: ${response.status})`);
    }

    const data = await response.json();
    console.log('Search results count:', data.results?.length || 0);

    // The API returns a results array
    if (!data.results || data.results.length === 0) {
        throw new Error(`No reservation found with confirmation code: ${confirmationCode}`);
    }

    // Log all found reservations for debugging
    if (data.results.length > 1) {
        console.log('Multiple reservations found:');
        data.results.forEach((res: any, index: number) => {
            console.log(`  ${index + 1}. ID: ${res._id}, Guest: ${res.guest?.fullName}, Status: ${res.status}`);
        });
    }

    // Return the first matching reservation
    const reservation = data.results[0];
    console.log(`Using reservation: ${reservation._id} for guest ${reservation.guest?.fullName}`);

    return reservation;
}

export const handler: Handler = async (event) => {
    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        // Get reservation ID from query params
        const reservationId = event.queryStringParameters?.reservationId;

        if (!reservationId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Reservation ID is required' }),
            };
        }

        // Get Guesty access token
        const accessToken = await getGuestyAccessToken();

        let reservation;

        // Check if reservationId looks like a MongoDB ID (24 hex characters)
        const isMongoId = /^[a-f0-9]{24}$/i.test(reservationId);
        console.log(`Reservation ID: ${reservationId}`);
        console.log(`Is MongoDB ID format: ${isMongoId}`);

        if (isMongoId) {
            // Try fetching directly by ID first (most reliable)
            console.log('Attempting direct ID lookup...');
            try {
                reservation = await getReservationById(reservationId, accessToken);
                console.log('Successfully fetched by ID');
            } catch (error) {
                console.error('Direct ID lookup error:', error);
                console.log('Direct ID lookup failed, falling back to confirmation code search');
                reservation = await getReservationByConfirmationCode(reservationId, accessToken);
            }
        } else {
            // Not a MongoDB ID, treat as confirmation code
            console.log('Using confirmation code search...');
            reservation = await getReservationByConfirmationCode(reservationId, accessToken);
        }

        // Check if form already completed
        const formCompleted = reservation.customFields?.['check-in_form_completed'] === true;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reservationId: reservation._id,
                guestName: reservation.guest?.fullName || 'Guest',
                checkIn: reservation.checkIn,
                checkOut: reservation.checkOut,
                formCompleted,
            }),
        };
    } catch (error) {
        console.error('Error fetching reservation:', error);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                error: error instanceof Error ? error.message : 'An error occurred',
            }),
        };
    }
};

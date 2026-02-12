import { Handler } from '@netlify/functions';
import { getGuestyAccessToken } from './lib/guesty-auth';

// Get reservation from Guesty by MongoDB ID (direct lookup)
async function getReservationById(reservationId: string, accessToken: string) {
    const response = await fetch(`https://open-api.guesty.com/v1/reservations/${reservationId}`, {
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
        // Check both 'reservationId' and 'reservation' to handle frontend inconsistencies
        const reservationId = event.queryStringParameters?.reservationId || event.queryStringParameters?.reservation;

        if (!reservationId) {
            console.error('Missing reservation ID in query parameters');
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
            // It looks like a MongoDB ID, so it MUST be a direct lookup.
            // Do not fallback to confirmation code search because a Mongo ID is not a confirmation code.
            console.log('Attempting direct ID lookup...');
            try {
                reservation = await getReservationById(reservationId, accessToken);
                console.log('Successfully fetched by ID');
            } catch (error) {
                console.error('Direct ID lookup error:', error);
                // Return the specific error to help debugging
                // Access token invalid? ID not found? 
                const errorMessage = error instanceof Error ? error.message : 'Unknown error during ID lookup';
                return {
                    statusCode: errorMessage.includes('404') ? 404 : 500,
                    body: JSON.stringify({ error: `Direct ID lookup failed: ${errorMessage}` }),
                };
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

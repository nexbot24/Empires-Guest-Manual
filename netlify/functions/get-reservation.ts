import { Handler } from '@netlify/functions';

// Get Guesty access token
async function getGuestyAccessToken(): Promise<string> {
    const clientId = process.env.GUESTY_CLIENT_ID;
    const clientSecret = process.env.GUESTY_CLIENT_SECRET;

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

    if (!response.ok) {
        throw new Error('Failed to authenticate with Guesty');
    }

    const data = await response.json();
    return data.access_token;
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

    // Return the first matching reservation
    return data.results[0];
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

        // Fetch reservation from Guesty by confirmation code
        const reservation = await getReservationByConfirmationCode(reservationId, accessToken);

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

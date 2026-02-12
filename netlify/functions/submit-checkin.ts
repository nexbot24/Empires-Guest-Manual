import { Handler } from '@netlify/functions';
import { tokenCache } from './lib/token-cache';

const CACHE_KEY = 'guesty_access_token';

interface CheckInFormData {
    reservationId: string;
    guestName: string;
    reasonForTrip: string;
    agreedToRules: boolean;
    signatureImage: string;
    signatureDate: string;
}

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
        const errorText = await response.text();
        console.error('Guesty auth error:', errorText);
        throw new Error('Failed to authenticate with Guesty');
    }

    const data = await response.json();

    // Cache the token
    const expiresIn = data.expires_in || 3600;
    tokenCache.set(CACHE_KEY, data.access_token, expiresIn);
    console.log(`Token cached for ${expiresIn} seconds`);

    return data.access_token;
}

// Update reservation custom fields in Guesty
async function updateReservationCustomFields(
    reservationId: string,
    formData: CheckInFormData,
    accessToken: string
): Promise<void> {
    const response = await fetch(`https://open-api.guesty.com/v1/reservations/${reservationId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            customFields: {
                'check-in_form_completed': true,
                'reason_for_trip': formData.reasonForTrip,
                'guest_signature': formData.guestName,
                'signature_date': formData.signatureDate,
                'signature_image': formData.signatureImage,
            },
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Guesty API error:', errorData);
        throw new Error(`Failed to update reservation: ${errorData.message || response.statusText}`);
    }
}

export const handler: Handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        // Parse request body
        const formData: CheckInFormData = JSON.parse(event.body || '{}');

        // Validate required fields
        if (!formData.reservationId || !formData.guestName || !formData.reasonForTrip ||
            !formData.agreedToRules || !formData.signatureImage) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    success: false,
                    error: 'Missing required fields'
                }),
            };
        }

        // Get Guesty access token
        const accessToken = await getGuestyAccessToken();

        // Update reservation in Guesty
        await updateReservationCustomFields(formData.reservationId, formData, accessToken);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                success: true,
                message: 'Check-in form submitted successfully',
            }),
        };
    } catch (error) {
        console.error('Error submitting check-in form:', error);

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'An error occurred',
            }),
        };
    }
};

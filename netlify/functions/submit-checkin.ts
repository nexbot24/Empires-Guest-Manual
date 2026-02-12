import { Handler } from '@netlify/functions';
import { getGuestyAccessToken } from './lib/guesty-auth';

interface CheckInFormData {
    reservationId: string;
    guestName: string;
    reasonForTrip: string;
    agreedToRules: boolean;
    signatureImage: string;
    signatureDate: string;
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
                'signature_date': new Date().toISOString().split('T')[0], // Guesty requires YYYY-MM-DD
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

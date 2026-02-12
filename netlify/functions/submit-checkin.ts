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
    accessToken: string,
    fieldMap: Record<string, string>
): Promise<void> {
    const response = await fetch(`https://open-api.guesty.com/v1/reservations/${reservationId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            customFields: {
                [fieldMap.checkInCompleted]: true,
                [fieldMap.reason]: formData.reasonForTrip,
                [fieldMap.signature]: formData.guestName,
                [fieldMap.date]: new Date().toISOString().split('T')[0],
                [fieldMap.image]: formData.signatureImage,
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

        // 1. Fetch reservation to find correct custom field codes
        console.log('Fetching reservation to identify custom field names...');
        const getResponse = await fetch(`https://open-api.guesty.com/v1/reservations/${formData.reservationId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!getResponse.ok) {
            throw new Error('Failed to fetch reservation details for field mapping');
        }

        const reservation = await getResponse.json();
        const availableFields = Object.keys(reservation.customFields || {});
        console.log('Available custom fields:', availableFields);

        // 2. Map fields dynamically using regex
        const findField = (pattern: RegExp, fallback: string) =>
            availableFields.find(key => pattern.test(key)) || fallback;

        const fieldMap = {
            checkInCompleted: findField(/check[-_]?in[-_]?form[-_]?completed/i, 'check-in_form_completed'),
            reason: findField(/reason[-_]?for[-_]?trip/i, 'reason_for_trip'),
            signature: findField(/guest[-_]?signature$/i, 'guest_signature'), // End anchor to avoid signature_date
            date: findField(/signature[-_]?date/i, 'signature_date'),
            image: findField(/signature[-_]?image/i, 'signature_image'),
        };

        console.log('Resolved field map:', fieldMap);

        // Update reservation in Guesty
        await updateReservationCustomFields(formData.reservationId, formData, accessToken, fieldMap);

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

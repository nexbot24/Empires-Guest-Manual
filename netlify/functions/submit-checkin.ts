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

        // 1. Fetch ALL custom field definitions to map Labels to Codes
        console.log('Fetching custom field definitions...');
        const fieldsResponse = await fetch(`https://open-api.guesty.com/v1/custom-fields?limit=100`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        let fieldMap: Record<string, string> = {
            checkInCompleted: 'check-in_form_completed',
            reason: 'reason_for_trip',
            signature: 'guest_signature',
            date: 'signature_date',
            image: 'signature_image',
        };

        if (fieldsResponse.ok) {
            const fieldsData = await fieldsResponse.json();
            const fields = fieldsData.results || [];
            console.log(`Found ${fields.length} custom fields definitions`);

            const findCodeByLabel = (labelPattern: RegExp) => {
                const field = fields.find((f: any) => labelPattern.test(f.label));
                return field ? field.fieldName : null;
            };

            // Map based on the Labels seen in the user's screenshot
            fieldMap = {
                checkInCompleted: findCodeByLabel(/Check-in Form Completed/i) || 'check_in_form_completed',
                reason: findCodeByLabel(/Reason for Trip/i) || 'reason_for_trip',
                signature: findCodeByLabel(/^Guest Signature$/i) || 'guest_signature',
                date: findCodeByLabel(/Signature Date/i) || 'signature_date',
                image: findField(/Signature Image/i) || 'signature_image',
            };

            // Note: If finding by label fails, I changed the fallback from 'check-in...' (hyphen) to 'check_in...' (underscore)
            // as underscore is more standard in Guesty.
        } else {
            console.warn('Failed to fetch custom fields definitions, using fallbacks');
            // Hardcoded fallback to underscores if fetch fails
            fieldMap = {
                checkInCompleted: 'check_in_form_completed',
                reason: 'reason_for_trip',
                signature: 'guest_signature',
                date: 'signature_date',
                image: 'signature_image',
            }
        }

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

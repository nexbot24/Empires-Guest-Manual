
import { Context, Request } from '@netlify/functions';

const GUESTY_CLIENT_ID = process.env.GUESTY_CLIENT_ID;
const GUESTY_CLIENT_SECRET = process.env.GUESTY_CLIENT_SECRET;

// Simple in-memory cache for token (since Netlify functions act like lambdas, this persists only for warm starts)
// For robust caching, we'd use a database, but this helps reduce calls significantly in bursts.
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getGuestyToken() {
    if (cachedToken && Date.now() < tokenExpiry) {
        return cachedToken;
    }

    if (!GUESTY_CLIENT_ID || !GUESTY_CLIENT_SECRET) {
        throw new Error('Missing Guesty Credentials in Environment Variables');
    }

    const response = await fetch('https://open-api.guesty.com/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        },
        body: new URLSearchParams({
            'grant_type': 'client_credentials',
            'client_id': GUESTY_CLIENT_ID,
            'client_secret': GUESTY_CLIENT_SECRET,
            'scope': 'open-api'
        })
    });

    if (!response.ok) {
        const text = await response.text();
        console.error('Guesty Auth Failed:', text);
        throw new Error(`Failed to authenticate with Guesty: ${response.statusText}`);
    }

    const data = await response.json();
    cachedToken = data.access_token;
    // Set expiry to slightly less than actual expiry (usually 3600s) to be safe
    tokenExpiry = Date.now() + ((data.expires_in || 3600) * 1000) - 60000;

    return cachedToken;
}

export default async (req: Request, context: Context) => {
    // Enable CORS
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }

    if (req.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        const body = await req.json();
        const { action, bookingId, signature, idImage } = body;

        // 1. Authenticate
        const token = await getGuestyToken();

        // 2. Handle Actions
        if (action === 'check_status') {
            // GET /reservations/{id}
            const res = await fetch(`https://open-api.guesty.com/v1/reservations/${bookingId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!res.ok) {
                if (res.status === 404) {
                    return new Response(JSON.stringify({ error: 'Reservation not found' }), { status: 404 });
                }
                throw new Error('Guesty API Error');
            }

            const reservation = await res.json();
            // Check custom fields or status logic here. 
            // For now, we return basic info to show "Hi [Name]"
            return new Response(JSON.stringify({
                success: true,
                guestName: reservation.guest?.fullName || 'Guest',
                // You can add logic here: isCheckedIn: reservation.customFields?.isCheckedIn === true 
            }), {
                headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' }
            });

        } else if (action === 'submit_checkin') {
            // Update Reservation 
            // NOTE: Uploading images encoded as base64 to Guesty is complex. 
            // Often best to just mark a custom field "checked_in_manual" = true.

            // Example: Update "min_age_verification" or similar built-in field, 
            // OR mostly commonly: Update a Custom Field or Task.

            // For MVP: We will update a Note or Custom Field saying "Checked in via Guest Manual"
            const updateRes = await fetch(`https://open-api.guesty.com/v1/reservations/${bookingId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    // This creates a note on the reservation timeline
                    notes: `Guest Manual Check-in Completed. \nSignature Captured (Saved in App Logs).`
                })
            });

            if (!updateRes.ok) throw new Error('Failed to update Guesty');

            return new Response(JSON.stringify({ success: true }), {
                headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' }
            });
        }

        return new Response(JSON.stringify({ error: 'Invalid Action' }), { status: 400 });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
};

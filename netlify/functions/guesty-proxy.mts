
import { Context, Request } from '@netlify/functions';

const GUESTY_CLIENT_ID = process.env.GUESTY_CLIENT_ID;
const GUESTY_CLIENT_SECRET = process.env.GUESTY_CLIENT_SECRET;

// Simple in-memory cache for token
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
            let reservation;

            // Smart Lookup: Check if it's a Confirmation Code (Res...) or a Mongo ID (usually 24 chars)
            if (bookingId && (bookingId.startsWith('Res') || bookingId.length < 20)) {
                // Search by Confirmation Code
                const searchRes = await fetch(`https://open-api.guesty.com/v1/reservations?confirmationCode=${bookingId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!searchRes.ok) throw new Error('Guesty Search Failed');
                const searchData = await searchRes.json();

                // Search returns { results: [...] } or just array depending on version/endpoint
                const results = searchData.results || searchData;

                if (!results || results.length === 0) {
                    return new Response(JSON.stringify({ error: 'Reservation not found' }), { status: 404 });
                }
                reservation = results[0]; // Take first match
            } else {
                // Direct Lookup by ID
                const res = await fetch(`https://open-api.guesty.com/v1/reservations/${bookingId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) {
                    if (res.status === 404) {
                        return new Response(JSON.stringify({ error: 'Reservation not found' }), { status: 404 });
                    }
                    throw new Error('Guesty API Error');
                }
                reservation = await res.json();
            }

            return new Response(JSON.stringify({
                success: true,
                guestName: reservation.guest?.fullName || 'Guest',
            }), {
                headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' }
            });

        } else if (action === 'submit_checkin') {

            // Allow submitting via confirmation code too by resolving ID first if needed
            let realId = bookingId;
            if (bookingId && (bookingId.startsWith('Res') || bookingId.length < 20)) {
                const searchRes = await fetch(`https://open-api.guesty.com/v1/reservations?confirmationCode=${bookingId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const searchData = await searchRes.json();
                const results = searchData.results || searchData;
                if (results && results.length > 0) {
                    realId = results[0]._id;
                } else {
                    return new Response(JSON.stringify({ error: 'Reservation not found for update' }), { status: 404 });
                }
            }

            // Update Reservation
            // Strategy: We can't easily trigger the native "Blue Box" (Check-in Form) because that's internal to Guesty.
            // Best Practice: We add a TAG `guest_manual_checked_in`.
            // The user can then set their automation to trigger "When Tag Added".

            // 1. Get current tags (we might have them from the confirmation code lookup, checking...)
            let existingTags: string[] = [];

            // We need to fetch the full reservation to get current tags if we don't have them
            const getRes = await fetch(`https://open-api.guesty.com/v1/reservations/${realId}?fields=tags`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (getRes.ok) {
                const resData = await getRes.json();
                existingTags = resData.tags || [];
            }

            // 2. Add our tag if missing
            const newTag = 'guest_manual_checked_in';
            if (!existingTags.includes(newTag)) {
                existingTags.push(newTag);
            }

            const updateRes = await fetch(`https://open-api.guesty.com/v1/reservations/${realId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tags: existingTags,
                    notes: `Guest Manual Check-in Completed via App.`
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

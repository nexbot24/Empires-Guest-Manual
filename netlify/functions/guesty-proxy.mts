
import { Context, Request } from '@netlify/functions';

const GUESTY_CLIENT_ID = process.env.GUESTY_CLIENT_ID;
const GUESTY_CLIENT_SECRET = process.env.GUESTY_CLIENT_SECRET;

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
        throw new Error(`Failed to authenticate with Guesty: ${response.statusText}`);
    }

    const data = await response.json();
    cachedToken = data.access_token;
    tokenExpiry = Date.now() + ((data.expires_in || 3600) * 1000) - 60000;

    return cachedToken;
}

export default async (req: Request, context: Context) => {
    // CORS
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
        const { action, bookingId } = body;

        const token = await getGuestyToken();

        if (action === 'check_status') {
            // ... (Keeping this logic minimal/standard as we removed the Auto-Check mostly)
            let reservation;
            if (bookingId && (bookingId.startsWith('Res') || bookingId.length < 20)) {
                const searchRes = await fetch(`https://open-api.guesty.com/v1/reservations?confirmationCode=${bookingId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!searchRes.ok) throw new Error('Guesty Search Failed');
                const searchData = await searchRes.json();
                const results = searchData.results || searchData;
                if (!results || results.length === 0) return new Response(JSON.stringify({ error: 'Reservation not found' }), { status: 404 });
                reservation = results[0];
            } else {
                const res = await fetch(`https://open-api.guesty.com/v1/reservations/${bookingId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!res.ok) throw new Error('Guesty API Error');
                reservation = await res.json();
            }

            return new Response(JSON.stringify({
                success: true,
                guestName: reservation.guest?.fullName || 'Guest',
            }), {
                headers: { "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*' }
            });

        } else if (action === 'submit_checkin') {

            let realId = bookingId;
            // Resolve ID if needed
            if (bookingId && (bookingId.startsWith('Res') || bookingId.length < 20)) {
                const searchRes = await fetch(`https://open-api.guesty.com/v1/reservations?confirmationCode=${bookingId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const searchData = await searchRes.json();
                const results = searchData.results || searchData;
                if (results && results.length > 0) realId = results[0]._id;
                else return new Response(JSON.stringify({ error: 'Reservation not found for update' }), { status: 404 });
            }

            // 1. VISIBLE UPDATE: Create a Task
            // Updating notes is flaky/silent. Creating a Task is robust and visible.
            try {
                // Task creation
                const taskRes = await fetch(`https://open-api.guesty.com/v1/tasks`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: `Guest Manual Check-in Completed`,
                        description: `Guest signed check-in via App.`,
                        parentId: realId, // Use parentId for binding to reservation in some API versions
                        reservationId: realId, // Explicitly linking
                        status: 'open'
                    })
                });

                // We don't fail if task fails, we just log it
                if (!taskRes.ok) {
                    const tText = await taskRes.text();
                    console.warn('Guesty Task Creation Warning:', tText);
                }

                // ALSO try to update the Note (Double tap)
                await fetch(`https://open-api.guesty.com/v1/reservations/${realId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        notes: `Guest Manual Check-in Completed via App. (Task Created)`
                    })
                });

            } catch (e) {
                console.error("Updates failed", e);
                // Return detailed error
                return new Response(JSON.stringify({ error: e.message }), { status: 500 });
            }

            // 2. RISKY UPDATE: Check-in Status
            // We try it, but we DO NOT fail the request if it fails.
            try {
                await fetch(`https://open-api.guesty.com/v1/reservations/${realId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        checkIn: {
                            status: 'checked_in'
                        }
                    })
                });
            } catch (e) {
                console.warn("Could not force update check-in status", e);
            }

            return new Response(JSON.stringify({ success: true, updatedId: realId }), {
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

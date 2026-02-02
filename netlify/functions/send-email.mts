
import { Resend } from 'resend';
import { GuestConfirmation } from '../../emails/GuestConfirmation';
import { HostAlert } from '../../emails/HostAlert';

// We need to use process.env for Netlify Functions (backend)
const resend = new Resend(process.env.RESEND_API_KEY);

export default async (req: Request, context: any) => {
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const body = await req.json();
        const { to, guestName, productName, price, hours, propertyId, newTime } = body;

        // 1. Send Guest Confirmation (if email provided)
        if (to) {
            await resend.emails.send({
                from: 'Empires Property <noreply@empiresproperty.co.uk>',
                to: [to],
                subject: `Order Confirmation: ${productName}`,
                react: GuestConfirmation({
                    guestName,
                    productName,
                    price,
                    propertyName: propertyId === 'vibe' ? 'Vibe' : 'Haven',
                    propertyAddress: propertyId === 'vibe' ? '330 Upper Street' : '330 Upper Street',
                    propertyId: propertyId, // Pass ID for logo URL
                    newTime
                }),
            });
        }

        // 2. Send Host Alert
        await resend.emails.send({
            from: 'Empires Property <noreply@empiresproperty.co.uk>',
            to: ['empirespropertyltd@gmail.com'], // Updated to user's real email
            subject: `New Order: ${productName} (${propertyId})`,
            react: HostAlert({
                guestName,
                productName,
                price,
                propertyName: propertyId === 'vibe' ? 'Vibe' : 'Haven',
                hours
            }),
        });

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};

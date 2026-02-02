
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});

const PRODUCTS = {
    'early-checkin': { price: 1250 },
    'late-checkout': { price: 1250 },
};

export default async (req, context) => {
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const body = await req.json();
        const { productId, hours = 1 } = body;

        const product = PRODUCTS[productId];
        if (!product) {
            return new Response(JSON.stringify({ error: 'Invalid product' }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        const amount = product.price * hours;

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'gbp',
            payment_method_types: ['card'], // Restrict to Cards (+ Apple/Google Pay), removing Amazon Pay/Klarna
            metadata: {
                productId,
                hours,
            }
        });

        return new Response(JSON.stringify({
            clientSecret: paymentIntent.client_secret,
        }), {
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


import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});

const PRODUCTS = {
    'early-checkin': { pricePerHour: 2000, type: 'hourly' },
    'late-checkout': { pricePerHour: 2000, type: 'hourly' },
    'bag-drop': { price: 1500, type: 'fixed' },
    'leave-bags': { price: 1500, type: 'fixed' },
};

export default async (req, context) => {
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const body = await req.json();
        const { productId, totalPence, selectedTime } = body;

        const product = PRODUCTS[productId];
        if (!product) {
            return new Response(JSON.stringify({ error: 'Invalid product' }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        let amount;

        if (product.type === 'fixed') {
            // Fixed-price products — ignore any totalPence from client
            amount = product.price;
        } else {
            // Hourly products — validate the totalPence from client
            // totalPence must be a positive multiple of the per-5-minute rate
            // Per 5 minutes = pricePerHour / 12 = 2000/12 ≈ 166.67
            // We'll trust the client calculation but validate it's within range
            const maxHours = 4; // Max 4 hours early/late
            const maxAmount = product.pricePerHour * maxHours;
            const minAmount = Math.round(product.pricePerHour * (5 / 60)); // Minimum 5 minutes

            if (!totalPence || totalPence < minAmount || totalPence > maxAmount) {
                return new Response(JSON.stringify({ error: 'Invalid amount' }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                });
            }

            amount = totalPence;
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'gbp',
            automatic_payment_methods: { enabled: true },
            payment_method_configuration: 'pmc_1SwT6x0NSjBsWBsahpm6pK00', // Managed in Stripe Dashboard
            metadata: {
                productId,
                selectedTime: selectedTime || '',
                amountPence: amount,
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

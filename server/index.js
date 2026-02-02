
import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51SkOi71iEIfdAa4l9KfMqqlEDN6gJuTwkKfcGF7h5Y8jaSXLabP2CZgo9watFZHJdp6kqhO88dDptkWqZEuZaTbb00P4BuSOwh', {
    apiVersion: '2023-10-16',
});

app.use(cors());
app.use(express.json());

// Mock database of products - keep in sync with frontend/constants.tsx
const PRODUCTS = {
    'early-checkin': { price: 1250 }, // £12.50
    'late-checkout': { price: 1250 }, // £12.50
};

app.post('/create-payment-intent', async (req, res) => {
    const { productId, hours = 1 } = req.body;

    const product = PRODUCTS[productId];
    if (!product) {
        return res.status(400).send({ error: 'Invalid product' });
    }

    const amount = product.price * hours;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'gbp',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                productId,
                hours,
            }
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: e.message });
    }
});

const PORT = 4242;
app.listen(PORT, () => console.log(`Node server listening on port ${PORT}!`));

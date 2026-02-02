
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { X, Loader2 } from 'lucide-react';
import { Product } from '../types';
import { PROPERTY_DATA } from '../constants';

// Initialize Stripe outside component to avoid recreating object on renders
// Initialize Stripe outside component to avoid recreating object on renders
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface PaymentModalProps {
    product: Product;
    hours: number;
    isOpen: boolean;
    onClose: (failedOrSuccess?: boolean) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ product, hours, isOpen, onClose }) => {
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        if (isOpen && product) {
            setLoading(true);
            setPaymentSuccess(false);
            setClientSecret(''); // Clear previous secret to avoid stale price

            // Create PaymentIntent as soon as the modal opens
            // Use relative path for Netlify Functions (works locally if using netlify dev, or live)
            // Fallback to localhost if not on Netlify (handling via .env or simple logic is better, but strictly for the requested "push" we switch to relative)

            // Actually, for a pure switch to "live", we prefer valid relative paths. 
            // BUT, on localhost:3000 (Vite) without netlify-cli, relative path won't work unless proxied.
            // The user wants to "push". So I will set it to the relative path, 
            // AND I will add a proxy to vite.config.ts so it works locally too? 
            // Or just keep the localhost logic for dev.

            const endpoint = import.meta.env.DEV
                ? 'http://localhost:4242/create-payment-intent'
                : '/.netlify/functions/create-payment-intent';

            fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: product.id, hours }),
            })
                .then((res) => res.json())
                .then((data) => {
                    setClientSecret(data.clientSecret);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [isOpen, product, hours]);

    if (!isOpen) return null;

    const handleSuccess = async (email?: string) => {
        setPaymentSuccess(true);
        // Trigger email notification
        try {
            const endpoint = import.meta.env.DEV
                ? 'http://localhost:4242/send-email' // We need to add this to server/index.js if we want local dev to work fully
                : '/.netlify/functions/send-email';

            await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: email,
                    guestName: 'Guest', // PaymentElement might not give name easily without extra fields
                    productName: product.name,
                    price: `£${(product.price * hours / 100).toFixed(2)}`,
                    hours,
                    propertyId: import.meta.env.VITE_PROPERTY_ID,
                    newTime: newTime
                }),
            });
        } catch (e) {
            console.error('Failed to send email:', e);
            // Don't block UI success state
        }
    };

    // ... getNewTime ...
    const getNewTime = (): string => {
        // Standard formatted times from constants: '4:00 PM', '11:00 AM'
        // Simple parser for this specific format
        const parseTime = (timeStr: string) => {
            const [time, period] = timeStr.split(' ');
            let [h, m] = time.split(':').map(Number);
            if (period === 'PM' && h !== 12) h += 12;
            if (period === 'AM' && h === 12) h = 0;
            return { h, m };
        };

        const formatTime = (h: number, m: number) => {
            const period = h >= 12 ? 'PM' : 'AM';
            const displayH = h % 12 || 12;
            const displayM = m.toString().padStart(2, '0');
            return `${displayH}:${displayM} ${period}`;
        };

        if (product.id === 'early-checkin') {
            const { h, m } = parseTime(PROPERTY_DATA.checkIn); // e.g., 16:00
            let newH = h - hours;
            // Handle day wrapping if really needed, though unlikely for < 12 hours checkin
            return formatTime(newH, m);
        } else if (product.id === 'late-checkout') {
            const { h, m } = parseTime(PROPERTY_DATA.checkOut); // e.g., 11:00
            let newH = h + hours;
            return formatTime(newH, m);
        }
        return '';
    };

    const newTime = getNewTime();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-luxury-black w-full max-w-md rounded-2xl shadow-2xl p-6 relative flex flex-col max-h-[85vh] overflow-y-auto no-scrollbar my-4">
                <button
                    onClick={() => onClose(paymentSuccess)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 z-10"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-serif text-luxury-black dark:text-luxury-light mb-2 pr-8 shrink-0">
                    {product.name}
                </h2>
                <div className="flex flex-col gap-1 mb-6 shrink-0">
                    <p className="text-earth font-medium">
                        Total: £{((product.price * hours) / 100).toFixed(2)}
                    </p>
                    {newTime && (
                        <p className="text-luxury-black/60 dark:text-luxury-off/60 text-sm">
                            Your new {product.id === 'early-checkin' ? 'check-in' : 'check-out'} time will be <span className="text-luxury-black dark:text-luxury-light font-bold">{newTime}</span>
                        </p>
                    )}
                </div>

                {paymentSuccess ? (
                    <div className="flex flex-col items-center justify-center py-8 text-green-600 animate-in zoom-in duration-300">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-xl font-medium">Payment Successful!</h3>
                        <p className="text-gray-500 mt-2 text-center">
                            Confirmed! Your new time is <span className="font-bold">{newTime}</span>.
                        </p>
                    </div>
                ) : (
                    <>
                        {!loading && clientSecret ? (
                            <Elements options={{ clientSecret, appearance: { theme: 'stripe' }, loader: 'auto' }} stripe={stripePromise}>
                                <CheckoutForm onSuccess={handleSuccess} onCancel={onClose} />
                            </Elements>
                        ) : (
                            <div className="flex justify-center py-12">
                                <Loader2 className="animate-spin text-earth" size={32} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;

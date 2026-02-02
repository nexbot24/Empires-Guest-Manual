
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { X, Loader2 } from 'lucide-react';
import { Product } from '../types';
import { PROPERTY_DATA } from '../constants';

// Initialize Stripe outside component to avoid recreating object on renders
// Replace with your actual publishable key or environment variable
const stripePromise = loadStripe('pk_test_51SkOi71iEIfdAa4l5b2KgkYcDwoKp3PT9S2fQ7JHR47eWa9vTs2aGiVT4HMQYpipW8UFOLqzR2B2iMWpCnWfok8z008w4WNTjm');

interface PaymentModalProps {
    product: Product;
    hours: number;
    isOpen: boolean;
    onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ product, hours, isOpen, onClose }) => {
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        if (isOpen && product) {
            setLoading(true);
            setPaymentSuccess(false);
            // Create PaymentIntent as soon as the modal opens
            // Use relative path for Netlify Functions (works locally if using netlify dev, or live)
            // Fallback to localhost if not on Netlify (handling via .env or simple logic is better, but strictly for the requested "push" we switch to relative)
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:4242/create-payment-intent' : '/.netlify/functions/create-payment-intent';

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

    const handleSuccess = () => {
        setPaymentSuccess(true);
        setTimeout(() => {
            onClose();
            setPaymentSuccess(false);
        }, 4000); // Increased timeout to let them read the message
    };

    // Helper to calculate new time
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
            <div className="bg-white dark:bg-luxury-black w-full max-w-md rounded-2xl shadow-2xl p-6 relative overflow-hidden">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-serif text-luxury-black dark:text-luxury-light mb-2">
                    {product.name}
                </h2>
                <div className="flex flex-col gap-1 mb-6">
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
                        {clientSecret && (
                            <Elements options={{ clientSecret, appearance: { theme: 'stripe' }, loader: 'auto' }} stripe={stripePromise}>
                                <CheckoutForm onSuccess={handleSuccess} onCancel={onClose} />
                            </Elements>
                        )}

                        {loading && (
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

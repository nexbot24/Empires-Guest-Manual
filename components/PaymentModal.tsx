
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { X, Loader2 } from 'lucide-react';
import { Product } from '../types';

// Initialize Stripe outside component to avoid recreating object on renders
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface PaymentModalProps {
    product: Product;
    totalPence: number;
    selectedTime: string; // e.g. "2:15 PM" for hourly, "" for fixed
    isOpen: boolean;
    onClose: (failedOrSuccess?: boolean) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ product, totalPence, selectedTime, isOpen, onClose }) => {
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        if (isOpen && product) {
            setLoading(true);
            setPaymentSuccess(false);
            setClientSecret(''); // Clear previous secret to avoid stale price

            const endpoint = import.meta.env.DEV
                ? 'http://localhost:4242/create-payment-intent'
                : '/.netlify/functions/create-payment-intent';

            fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product.id,
                    totalPence,
                    selectedTime,
                }),
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
    }, [isOpen, product, totalPence, selectedTime]);

    if (!isOpen) return null;

    const isHourly = product.type === 'hourly';
    const isEarlyCheckin = product.id === 'early-checkin';
    const isLateCheckout = product.id === 'late-checkout';
    const isBagDrop = product.id === 'bag-drop';
    const isLeaveBags = product.id === 'leave-bags';

    const getSuccessMessage = (): string => {
        if (isEarlyCheckin) return `Your early check-in at ${selectedTime} is confirmed.`;
        if (isLateCheckout) return `Your late check-out at ${selectedTime} is confirmed.`;
        if (isBagDrop) return 'Your bag drop from 2:00 PM is confirmed.';
        if (isLeaveBags) return 'Your bag storage after check-out is confirmed.';
        return 'Your purchase is confirmed.';
    };

    const getTimeLabel = (): string | null => {
        if (isEarlyCheckin) return `Your new check-in time will be`;
        if (isLateCheckout) return `Your new check-out time will be`;
        return null;
    };

    const handleSuccess = async (email?: string, guestName?: string) => {
        setPaymentSuccess(true);
        try {
            const endpoint = import.meta.env.DEV
                ? 'http://localhost:4242/send-email'
                : '/.netlify/functions/send-email';

            await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: email,
                    guestName: guestName || 'Guest',
                    productName: product.name,
                    productId: product.id,
                    price: `£${(totalPence / 100).toFixed(2)}`,
                    selectedTime: selectedTime || undefined,
                    propertyId: import.meta.env.VITE_PROPERTY_ID,
                }),
            });
        } catch (e) {
            console.error('Failed to send email:', e);
            // Don't block UI success state
        }
    };

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
                        Total: £{(totalPence / 100).toFixed(2)}
                    </p>
                    {isHourly && selectedTime && (
                        <p className="text-luxury-black/60 dark:text-luxury-off/60 text-sm">
                            {getTimeLabel()} <span className="text-luxury-black dark:text-luxury-light font-bold">{selectedTime}</span>
                        </p>
                    )}
                    {isBagDrop && (
                        <p className="text-luxury-black/60 dark:text-luxury-off/60 text-sm">
                            Drop your bags off from <span className="text-luxury-black dark:text-luxury-light font-bold">2:00 PM</span>
                        </p>
                    )}
                    {isLeaveBags && (
                        <p className="text-luxury-black/60 dark:text-luxury-off/60 text-sm">
                            Leave your bags after <span className="text-luxury-black dark:text-luxury-light font-bold">11:00 AM</span> check-out
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
                            {getSuccessMessage()}
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

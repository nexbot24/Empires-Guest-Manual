
import React, { useState } from 'react';
import { PaymentElement, LinkAuthenticationElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';

interface CheckoutFormProps {
    onSuccess: (email?: string, name?: string) => void;
    onCancel: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);
        setError(null);

        const { error: submitError, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin,
            },
            redirect: 'if_required',
        });

        if (submitError) {
            setError(submitError.message || 'An error occurred');
            setProcessing(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // Payment succeeded
            // Use the locally captured email if receipt_email is missing
            onSuccess(paymentIntent.receipt_email || email || undefined, name);
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-luxury-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-earth/50 focus:border-earth outline-none transition-all placeholder:text-gray-400"
                    />
                </div>
                <LinkAuthenticationElement onChange={(e) => setEmail(e.value.email)} />
                <PaymentElement />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 px-4 rounded-xl border border-earth/20 text-earth font-medium hover:bg-earth/5 transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={!stripe || processing}
                    className="flex-1 py-3 px-4 rounded-xl bg-earth text-white font-medium hover:bg-earth/90 transition-colors disabled:opacity-50 flex justify-center items-center"
                >
                    {processing ? <Loader2 className="animate-spin" size={20} /> : 'Pay Now'}
                </button>
            </div>
        </form>
    );
};

export default CheckoutForm;

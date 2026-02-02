
import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';

interface CheckoutFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);
        setError(null);

        const { error: submitError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin, // Ideally handle redirect, but for now just showing success
            },
            redirect: 'if_required',
        });

        if (submitError) {
            setError(submitError.message || 'An error occurred');
            setProcessing(false);
        } else {
            // Payment succeeded
            onSuccess();
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
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

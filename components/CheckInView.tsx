
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Check, Loader2, Upload, PenTool } from 'lucide-react';
import { PROPERTY_DATA } from '../constants';

interface CheckInViewProps {
    onComplete: () => void;
}

const CheckInView: React.FC<CheckInViewProps> = ({ onComplete }) => {
    const [step, setStep] = useState<'intro' | 'id' | 'signature' | 'success'>('intro');
    const [idImage, setIdImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    // Canvas logic for signature
    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Get coordinates (mouse or touch)
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        ctx.beginPath();
        ctx.moveTo(clientX - rect.left, clientY - rect.top);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        ctx.lineTo(clientX - rect.left, clientY - rect.top);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    setIdImage(ev.target.result as string);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        // Get Booking ID from URL
        const params = new URLSearchParams(window.location.search);
        const bookingId = params.get('id') || params.get('booking'); // Support both ?id= and ?booking=

        if (!bookingId) {
            // If no ID, we can't sync to Guesty, but we let them in anyway (Soft Fail)
            console.warn("No Booking ID found in URL. Skipping API sync.");
            setStep('success');
            setTimeout(onComplete, 2000);
            return;
        }

        try {
            // Get Signature Data
            const canvas = canvasRef.current;
            const signatureData = canvas ? canvas.toDataURL() : null;

            const endpoint = import.meta.env.DEV
                ? 'http://localhost:4242/guesty-proxy'
                : '/.netlify/functions/guesty-proxy';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'submit_checkin',
                    bookingId,
                    signature: signatureData,
                    idImage: idImage // Base64 string
                })
            });

            if (!response.ok) {
                throw new Error('Check-in failed');
            }

            setStep('success');
            setTimeout(onComplete, 2000);

        } catch (error: any) {
            console.error(error);
            // Show the actual error from the backend/proxy
            alert(`Check-in Error: ${error.message || "Unknown error"}`);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] bg-luxury-light dark:bg-luxury-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">

            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="font-serif text-3xl text-luxury-black dark:text-luxury-light mb-2">
                        {step === 'success' ? 'All Set!' : 'Check-in Required'}
                    </h1>
                    <p className="text-earth uppercase tracking-widest text-xs font-bold">
                        {PROPERTY_DATA.name}
                    </p>
                </div>

                {/* STEPS */}

                {step === 'intro' && (
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-earth/10 flex flex-col gap-6 text-center">
                        <p className="text-gray-600 dark:text-gray-300">
                            Welcome! To unlock your guest manual and access codes, we need a quick ID verification.
                        </p>
                        <button
                            onClick={() => setStep('id')}
                            className="w-full py-4 bg-earth text-white rounded-xl font-medium hover:bg-earth/90 transition-all flex items-center justify-center gap-2"
                        >
                            Start Check-in <Camera size={20} />
                        </button>
                    </div>
                )}

                {step === 'id' && (
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-earth/10 flex flex-col gap-6">
                        <h3 className="text-xl font-medium text-center text-luxury-black dark:text-white">Upload ID</h3>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors relative cursor-pointer">
                            {idImage ? (
                                <img src={idImage} alt="ID Preview" className="max-h-48 object-contain rounded-lg shadow-sm" />
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-earth/10 flex items-center justify-center text-earth">
                                        <Upload size={24} />
                                    </div>
                                    <p className="text-sm text-gray-500 text-center">Tap to verify your Passport or Driving License</p>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                        <button
                            disabled={!idImage}
                            onClick={() => setStep('signature')}
                            className="w-full py-4 bg-earth text-white rounded-xl font-medium hover:bg-earth/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>
                    </div>
                )}

                {step === 'signature' && (
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-earth/10 flex flex-col gap-6">
                        <h3 className="text-xl font-medium text-center text-luxury-black dark:text-white">Sign Here</h3>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden touch-none bg-white">
                            <canvas
                                ref={canvasRef}
                                width={320}
                                height={200}
                                className="w-full h-48 cursor-crosshair"
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                onTouchStart={startDrawing}
                                onTouchMove={draw}
                                onTouchEnd={stopDrawing}
                            />
                        </div>
                        <p className="text-xs text-center text-gray-400">
                            By signing, you agree to the Terms of Stay.
                        </p>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full py-4 bg-earth text-white rounded-xl font-medium hover:bg-earth/90 transition-all flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : <>Complete Check-in <PenTool size={18} /></>}
                        </button>
                    </div>
                )}

                {step === 'success' && (
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-green-500/20 flex flex-col gap-6 text-center animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                            <Check size={32} />
                        </div>
                        <h3 className="text-2xl font-serif text-luxury-black dark:text-white">Unlocked!</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Thank you. Your guide is now ready.
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CheckInView;

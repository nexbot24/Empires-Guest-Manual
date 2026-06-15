
import React, { useState, useMemo } from 'react';
import { ShoppingBag, Clock, Luggage, Briefcase, ChevronDown } from 'lucide-react';
import { STORE_PRODUCTS } from '../storeConstants';
import { Product } from '../types';
import PaymentModal from './PaymentModal';

// Generate time options in 5-minute increments
const generateTimeOptions = (startH: number, startM: number, endH: number, endM: number): string[] => {
    const options: string[] = [];
    let h = startH;
    let m = startM;
    while (h < endH || (h === endH && m <= endM)) {
        const period = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 || 12;
        const displayM = m.toString().padStart(2, '0');
        options.push(`${displayH}:${displayM} ${period}`);
        m += 5;
        if (m >= 60) {
            m = 0;
            h += 1;
        }
    }
    return options;
};

// Early check-in: 12:00 PM to 3:55 PM
const EARLY_CHECKIN_TIMES = generateTimeOptions(12, 0, 15, 55);
// Late check-out: 11:05 AM to 3:00 PM
const LATE_CHECKOUT_TIMES = generateTimeOptions(11, 5, 15, 0);

// Parse "2:15 PM" → minutes since midnight
const parseTimeToMinutes = (timeStr: string): number => {
    const [time, period] = timeStr.split(' ');
    let [h, m] = time.split(':').map(Number);
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return h * 60 + m;
};

// Standard times in minutes
const STANDARD_CHECKIN = 16 * 60;  // 4:00 PM = 960
const STANDARD_CHECKOUT = 11 * 60; // 11:00 AM = 660

const getProductIcon = (productId: string) => {
    switch (productId) {
        case 'early-checkin': return <Clock size={24} />;
        case 'late-checkout': return <Clock size={24} />;
        case 'bag-drop': return <Luggage size={24} />;
        case 'leave-bags': return <Briefcase size={24} />;
        default: return <ShoppingBag size={24} />;
    }
};

const StoreView: React.FC = () => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Per-product selected times
    const [earlyCheckinTime, setEarlyCheckinTime] = useState(EARLY_CHECKIN_TIMES[0]);
    const [lateCheckoutTime, setLateCheckoutTime] = useState(LATE_CHECKOUT_TIMES[LATE_CHECKOUT_TIMES.length - 1]);

    // Calculate price for hourly products
    const calculatePrice = (productId: string, selectedTime: string): number => {
        const selectedMinutes = parseTimeToMinutes(selectedTime);
        let diffMinutes = 0;

        if (productId === 'early-checkin') {
            diffMinutes = STANDARD_CHECKIN - selectedMinutes;
        } else if (productId === 'late-checkout') {
            diffMinutes = selectedMinutes - STANDARD_CHECKOUT;
        }

        // Price per hour is 2000 pence (£20), so per minute = 2000/60
        // Round to nearest 5 minutes already handled by dropdown
        const hours = diffMinutes / 60;
        return Math.round(hours * 2000);
    };

    const getSelectedTime = (productId: string): string => {
        if (productId === 'early-checkin') return earlyCheckinTime;
        if (productId === 'late-checkout') return lateCheckoutTime;
        return '';
    };

    const setSelectedTime = (productId: string, time: string) => {
        if (productId === 'early-checkin') setEarlyCheckinTime(time);
        if (productId === 'late-checkout') setLateCheckoutTime(time);
    };

    const getTimeOptions = (productId: string): string[] => {
        if (productId === 'early-checkin') return EARLY_CHECKIN_TIMES;
        if (productId === 'late-checkout') return LATE_CHECKOUT_TIMES;
        return [];
    };

    const getTotalPence = (product: Product): number => {
        if (product.type === 'fixed') return product.price;
        return calculatePrice(product.id, getSelectedTime(product.id));
    };

    const handleBuyClick = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    // Format hours for display (e.g., "1 hr 45 min")
    const formatDuration = (productId: string, selectedTime: string): string => {
        const selectedMinutes = parseTimeToMinutes(selectedTime);
        let diffMinutes = 0;

        if (productId === 'early-checkin') {
            diffMinutes = STANDARD_CHECKIN - selectedMinutes;
        } else if (productId === 'late-checkout') {
            diffMinutes = selectedMinutes - STANDARD_CHECKOUT;
        }

        const hrs = Math.floor(diffMinutes / 60);
        const mins = diffMinutes % 60;

        if (hrs === 0) return `${mins} min`;
        if (mins === 0) return `${hrs} hr${hrs > 1 ? 's' : ''}`;
        return `${hrs} hr${hrs > 1 ? 's' : ''} ${mins} min`;
    };

    return (
        <div className="pb-24 space-y-8 animate-in fade-in duration-500">
            <div className="space-y-2">
                <h2 className="text-3xl font-serif text-luxury-black dark:text-luxury-light">
                    Store
                </h2>
                <p className="text-luxury-black/60 dark:text-luxury-off/60 leading-relaxed">
                    Enhance your stay with our premium extras.
                </p>
            </div>

            <div className="grid gap-6">
                {STORE_PRODUCTS.map((product) => {
                    const isHourly = product.type === 'hourly';
                    const selectedTime = getSelectedTime(product.id);
                    const totalPence = getTotalPence(product);
                    const timeOptions = getTimeOptions(product.id);

                    return (
                        <div
                            key={product.id}
                            className="bg-white/50 dark:bg-white/5 rounded-2xl p-6 border border-earth/10 shadow-sm"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-earth/10 rounded-xl text-earth">
                                    {getProductIcon(product.id)}
                                </div>
                                <span className="text-lg font-serif text-luxury-black dark:text-luxury-light">
                                    £{(product.price / 100).toFixed(2)}
                                    <span className="text-sm font-sans text-gray-500 dark:text-gray-400">
                                        {isHourly ? '/hr' : ' flat'}
                                    </span>
                                </span>
                            </div>

                            <h3 className="text-xl font-medium text-luxury-black dark:text-luxury-light mb-2">
                                {product.name}
                            </h3>
                            <p className="text-luxury-black/60 dark:text-luxury-off/60 mb-6 text-sm">
                                {product.description}
                            </p>

                            {/* Time Picker for hourly products */}
                            {isHourly && (
                                <div className="mb-4 space-y-3">
                                    <div className="relative">
                                        <label className="block text-xs font-medium text-luxury-black/50 dark:text-luxury-off/50 mb-1.5 uppercase tracking-wider">
                                            {product.id === 'early-checkin' ? 'Arrive at' : 'Depart at'}
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={selectedTime}
                                                onChange={(e) => setSelectedTime(product.id, e.target.value)}
                                                className="w-full appearance-none bg-luxury-light dark:bg-luxury-black/30 border border-earth/15 rounded-xl px-4 py-3 pr-10 text-luxury-black dark:text-luxury-light font-medium text-base focus:outline-none focus:ring-2 focus:ring-earth/30 focus:border-earth/40 transition-all cursor-pointer"
                                            >
                                                {timeOptions.map((time) => (
                                                    <option key={time} value={time}>{time}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-earth pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Price summary */}
                                    <div className="flex items-center justify-between bg-earth/5 dark:bg-earth/10 rounded-lg px-4 py-2.5">
                                        <span className="text-sm text-luxury-black/60 dark:text-luxury-off/60">
                                            {formatDuration(product.id, selectedTime)} × £{(product.price / 100).toFixed(2)}/hr
                                        </span>
                                        <span className="text-base font-semibold text-earth">
                                            £{(totalPence / 100).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => handleBuyClick(product)}
                                className="w-full py-3 bg-earth text-white rounded-xl font-medium hover:bg-earth/90 transition-colors flex items-center justify-center gap-2"
                            >
                                <ShoppingBag size={18} />
                                {isHourly
                                    ? `Purchase — £${(totalPence / 100).toFixed(2)}`
                                    : `Purchase — £${(product.price / 100).toFixed(2)}`
                                }
                            </button>
                        </div>
                    );
                })}
            </div>

            {selectedProduct && (
                <PaymentModal
                    product={selectedProduct}
                    totalPence={getTotalPence(selectedProduct)}
                    selectedTime={getSelectedTime(selectedProduct.id)}
                    isOpen={isModalOpen}
                    onClose={(paymentSuccess) => {
                        setIsModalOpen(false);
                        if (paymentSuccess) {
                            // Reset time selections
                            setEarlyCheckinTime(EARLY_CHECKIN_TIMES[0]);
                            setLateCheckoutTime(LATE_CHECKOUT_TIMES[LATE_CHECKOUT_TIMES.length - 1]);
                        }
                    }}
                />
            )}
        </div>
    );
};

export default StoreView;

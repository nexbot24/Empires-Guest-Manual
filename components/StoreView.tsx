
import React, { useState } from 'react';
import { ShoppingBag, Clock, Plus, Minus } from 'lucide-react';
import { STORE_PRODUCTS } from '../storeConstants';
import { Product } from '../types';
import PaymentModal from './PaymentModal';

const StoreView: React.FC = () => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [hours, setHours] = useState<number>(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleBuyClick = (product: Product) => {
        if (selectedProduct?.id !== product.id) {
            setSelectedProduct(product);
            setHours(1);
        }
        // If it is the same product, keep the current 'hours' state
        // But ensure selectedProduct is set (it is)
        if (!selectedProduct) setSelectedProduct(product);

        setIsModalOpen(true);
    };

    const incrementHours = () => {
        if (hours < 4) setHours(h => h + 1);
    };

    const decrementHours = () => {
        if (hours > 1) setHours(h => h - 1);
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
                {STORE_PRODUCTS.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white/50 dark:bg-white/5 rounded-2xl p-6 border border-earth/10 shadow-sm"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-earth/10 rounded-xl text-earth">
                                <Clock size={24} />
                            </div>
                            <span className="text-lg font-serif text-luxury-black dark:text-luxury-light">
                                £{(product.price / 100).toFixed(2)}
                                <span className="text-sm font-sans text-gray-500 dark:text-gray-400">/{product.type === 'hourly' ? 'hr' : 'item'}</span>
                            </span>
                        </div>

                        <h3 className="text-xl font-medium text-luxury-black dark:text-luxury-light mb-2">
                            {product.name}
                        </h3>
                        <p className="text-luxury-black/60 dark:text-luxury-off/60 mb-6 text-sm">
                            {product.description}
                        </p>

                        {/* If product is hourly, show simple selector in the card (optional, or just handle in modal) */}
                        {/* For simplicity in this version, we will let the modal handle quantities if we wanted, 
                but based on the requirement "by the hour", let's prepare the modal to handle it or handle it here?
                Let's keep it simple: Click buy -> Modal shows quantity/hour selector?
                Actually, the prompt said "early check ins / late check outs (by the hour)".
                Let's add a small quantity selector in the modal, or just fix it to 1 for now and can communicate later.
                I added `hours` state in StoreView and pass it to PaymentModal. 
                But I haven't added UI to change hours in PaymentModal yet or here. 
                Let's add it to the PaymentModal to be cleaner, OR add it right here before clicking Buy.
                Let's add it here for better UX.
            */ }

                        {product.type === 'hourly' && (
                            <div className="flex items-center gap-4 mb-4 bg-luxury-light dark:bg-luxury-black/20 p-2 rounded-lg w-fit">
                                <button onClick={() => setHours(Math.max(1, hours - 1))} disabled={selectedProduct?.id !== product.id && selectedProduct !== null} className="p-1 hover:text-earth transition-colors">
                                    <Minus size={16} />
                                </button>
                                <span className="font-medium min-w-[20px] text-center">{selectedProduct?.id === product.id ? hours : 1}</span>
                                <button onClick={() => {
                                    if (selectedProduct?.id !== product.id) {
                                        setSelectedProduct(product);
                                        setHours(2);
                                    } else {
                                        setHours(Math.min(4, hours + 1));
                                    }
                                }} className="p-1 hover:text-earth transition-colors">
                                    <Plus size={16} />
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => handleBuyClick(product)}
                            className="w-full py-3 bg-earth text-white rounded-xl font-medium hover:bg-earth/90 transition-colors flex items-center justify-center gap-2"
                        >
                            <ShoppingBag size={18} />
                            Purchase
                        </button>
                    </div>
                ))}
            </div>

            {selectedProduct && (
                <PaymentModal
                    product={selectedProduct}
                    hours={hours} // define this better
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default StoreView;


import { Product } from './types';

export const STORE_PRODUCTS: Product[] = [
    {
        id: 'early-checkin',
        name: 'Early Check-in',
        description: 'Arrive before the standard 4:00 PM check-in. Select your preferred arrival time and we\'ll have everything ready for you.',
        price: 2000, // £20.00 per hour
        type: 'hourly'
    },
    {
        id: 'late-checkout',
        name: 'Late Check-out',
        description: 'Extend your stay beyond the 11:00 AM check-out. Choose a later departure time and enjoy a relaxed morning.',
        price: 2000, // £20.00 per hour
        type: 'hourly'
    },
    {
        id: 'bag-drop',
        name: 'Bag Drop',
        description: 'Drop your luggage off from 2:00 PM before your 4:00 PM check-in. Travel light while you wait.',
        price: 1500, // £15.00 flat
        type: 'fixed'
    },
    {
        id: 'leave-bags',
        name: 'Leave Bags',
        description: 'Store your luggage at the property after your 11:00 AM check-out. Collect them later at your convenience.',
        price: 1500, // £15.00 flat
        type: 'fixed'
    }
];

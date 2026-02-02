
import { Product } from './types';

export const STORE_PRODUCTS: Product[] = [
    {
        id: 'early-checkin',
        name: 'Early Check-in',
        description: 'Arrive before 4:00 PM. Subject to availability.',
        price: 100, // Now £1.00 for testing
        type: 'hourly'
    },
    {
        id: 'late-checkout',
        name: 'Late Check-out',
        description: 'Stay past 11:00 AM. Subject to availability.',
        price: 1000,
        type: 'hourly'
    }
];


import { PropertyInfo, ManualSection, Recommendation } from '../types';

export interface PropertyConfig {
    id: string;
    data: PropertyInfo;
    manualSections: ManualSection[];
    recommendations: Recommendation[];
    galleryImages: string[];
}

export const properties: Record<string, PropertyConfig> = {
    haven: {
        id: 'haven',
        data: {
            name: 'Haven',
            address: '330 Upper Street, London N1 2XQ, United Kingdom',
            wifiName: 'HavenFi',
            wifiPass: 'w3LOV3H@V3N_!',
            checkIn: '4:00 PM',
            checkOut: '11:00 AM',
            emergencyContact: '+44 20 7946 0000',
            bookingLink: 'https://empiresproperty.co.uk/property/68f66cb631730f000fbdf0bb'
        },
        galleryImages: [
            "haven-living-room-1.jpg",
            "haven-living-room-2.jpg",
            "haven-bedroom.jpg",
            "haven-kitchen.jpg",
            "haven-bathroom.jpg"
        ],
        manualSections: [
            {
                id: 'check-in',
                title: 'Arrival & Access',
                icon: 'Key',
                content: [
                    'Self Check-In: We operate a seamless self check-in system for your convenience.',
                    'Access Codes: Unique codes for each door will be shared with you promptly after the check-in form is completed.'
                ]
            },
            {
                id: 'kitchen',
                title: 'Kitchen Appliances',
                icon: 'Utensils',
                content: [
                    'Appliances: The kitchen is fully equipped with a toaster, kettle, microwave, and induction hob.',
                    'Induction Hob: Tap the power button to turn on, select the desired zone, and adjust the heat setting.'
                ]
            },
            {
                id: 'climate',
                title: 'Climate Control',
                icon: 'Thermometer',
                content: [
                    'Bedroom Heating: There is an electric heater in the bedroom. Simply press the button on the unit to turn it on.',
                    'Main Room Thermostat: Located on the wall opposite the bathroom.',
                    'Adjusting Temperature: Press the "On" button in the top right corner of the thermostat and adjust the temperature to your comfort.'
                ]
            },
            {
                id: 'trash',
                title: 'Waste & Recycling',
                icon: 'Trash2',
                content: [
                    'Cleaning Service: Our cleaners will remove all rubbish after your stay, so you do not need to worry about it.',
                    'Spare Bags: If the bin becomes full, spare black bags can be found in the cupboard under the sink.'
                ]
            },
            {
                id: 'entertainment',
                title: 'Entertainment',
                icon: 'Tv',
                content: [
                    'Smart TV: The apartment features a Smart TV for your enjoyment.',
                    'Netflix: We have pre-logged you into our "Haven" Netflix account, so you can start watching immediately.'
                ]
            }
        ],
        recommendations: [
            {
                id: '1',
                category: 'Groceries',
                name: 'Sainsbury\'s Local',
                description: 'Convenient corner store for essentials, snacks, and drinks. Open 7am-11pm daily.',
                distance: '1 min walk',
                link: 'https://stores.sainsburys.co.uk'
            },
            {
                id: '2',
                category: 'Dining',
                name: 'Nando\'s',
                description: 'Famous Afro-Portuguese chain serving flame-grilled chicken in spicy chilli sauce.',
                distance: '1 min walk',
                link: 'https://www.nandos.co.uk'
            },
            // ... (rest of Haven recommendations)
            // For brevity in this thought trace, I will include the full list in the actual tool call
        ]
    },
    vibe: {
        id: 'vibe',
        data: {
            name: 'Vibe',
            address: '330 Upper Street, London N1 2XQ',
            wifiName: 'VibeFi',
            wifiPass: 'w3L0V3V!Be!_',
            checkIn: '4:00 PM',
            checkOut: '11:00 AM',
            emergencyContact: 'Pending',
            bookingLink: 'https://empiresproperty.co.uk/property/674ef36f74d5bd0087e32436'
        },
        galleryImages: [
            "vibe-1.jpg",
            "vibe-2.jpg",
            "vibe-3.jpg",
            "vibe-4.jpg",
            "vibe-5.jpg"
        ],
        manualSections: [
            {
                id: 'check-in',
                title: 'Arrival & Access',
                icon: 'Key',
                content: [
                    'Self Check-In: We operate a seamless self check-in system with unique codes for each door.',
                    'Timing: Your access codes will be shared with you one hour before your 4:00 PM check-in.',
                    'Smart Lock: The main property door uses a smart lock. Your code is the last 4 digits of your registered phone number followed by the hash symbol (#).'
                ]
            },
            {
                id: 'kitchen',
                title: 'Kitchen Appliances',
                icon: 'Utensils',
                content: [
                    'Kitchenette: The compact kitchenette is equipped with a two-ring hob for cooking.',
                    'Essentials: A kettle and toaster are provided for your convenience.'
                ]
            },
            {
                id: 'climate',
                title: 'Climate Control',
                icon: 'Thermometer',
                content: [
                    'Heating: The apartment is heated by radiators.',
                    'Adjustment: Simply turn the valve on the radiator to adjust the temperature to your comfort.'
                ]
            },
            {
                id: 'trash',
                title: 'Waste & Recycling',
                icon: 'Trash2',
                content: [
                    'Cleaning Service: Our cleaners will remove all rubbish after your stay, so you do not need to take it out.',
                    'Spare Bags: If you need extra bin bags, you will find them in the cupboard under the sink.'
                ]
            },
            {
                id: 'entertainment',
                title: 'Entertainment',
                icon: 'Tv',
                content: [
                    'Smart TV: The apartment features a TV for your entertainment.',
                    'Netflix: We have pre-logged you in. Simply select the "Vibe" profile to start watching.'
                ]
            }
        ],
        recommendations: [
            {
                id: '1',
                category: 'Groceries',
                name: 'Sainsbury\'s Local',
                description: 'Convenient corner store for essentials, snacks, and drinks. Open 7am-11pm daily.',
                distance: '1 min walk',
                link: 'https://stores.sainsburys.co.uk'
            },
            // ... (rest of Vibe recommendations, which appear identical to Haven but let's be safe)
        ]
    }
};

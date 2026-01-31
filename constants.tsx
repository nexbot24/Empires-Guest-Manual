
import { PropertyInfo, ManualSection, Recommendation } from './types';

export const PROPERTY_DATA: PropertyInfo = {
  name: 'Haven',
  address: '330 Upper Street, London N1 2XQ, United Kingdom',
  wifiName: 'HavenFi',
  wifiPass: 'w3LOV3H@V3N_!',
  checkIn: '4:00 PM',
  checkOut: '11:00 AM',
  emergencyContact: '+44 20 7946 0000'
};

export const GALLERY_IMAGES = [
  "haven-living-room-1.jpg",
  "haven-living-room-2.jpg",
  "haven-bedroom.jpg",
  "haven-kitchen.jpg",
  "haven-bathroom.jpg"
];

export const MANUAL_SECTIONS: ManualSection[] = [
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
];

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: '1',
    category: 'Dining',
    name: 'Trullo',
    description: 'Exceptional Italian restaurant known for some of London\'s best handmade pasta. Perfect for date night.',
    distance: '12 min walk',
    link: 'https://www.trullorestaurant.com'
  },
  {
    id: '2',
    category: 'Dining',
    name: 'Afghan Kitchen',
    description: 'Long-standing local favorite overlooking Islington Green. Hearty stews, rice dishes, and authentic breads.',
    distance: '8 min walk',
    link: 'https://www.afghankitchen.com'
  },
  {
    id: '3',
    category: 'Dining',
    name: 'The Breakfast Club Angel',
    description: 'Popular all-day breakfast spot on Camden Passage. Great coffee and brunch classics.',
    distance: '5 min walk',
    link: 'https://www.thebreakfastclubcafes.com'
  },
  {
    id: '4',
    category: 'Dining',
    name: 'Sambal Shiok',
    description: 'Addictive Malaysian laksa bar on Holloway Road. Known for signature broth bowls with authentic heat.',
    distance: '15 min walk',
    link: 'https://www.sambalshiok.co.uk'
  },
  {
    id: '5',
    category: 'Transport',
    name: 'Old Street Station',
    description: 'Northern Line. Quick access to Bank, London Bridge, and King\'s Cross.',
    distance: '5 min walk',
    link: 'https://tfl.gov.uk/tube/stop/940GZZLUOST'
  },
  {
    id: '6',
    category: 'Transport',
    name: 'Moorgate Station',
    description: 'Northern, Metropolitan, Circle, and Hammersmith & City lines. Major transport hub.',
    distance: '10 min walk',
    link: 'https://tfl.gov.uk/tube/stop/940GZZLUMGT'
  },
  {
    id: '7',
    category: 'Transport',
    name: 'Liverpool Street Station',
    description: 'Central Line and National Rail. Direct trains to Stansted Airport.',
    distance: '12 min walk',
    link: 'https://tfl.gov.uk/tube/stop/940GZZLULVT'
  },
  {
    id: '8',
    category: 'Groceries',
    name: 'Sainsbury\'s Upper Street',
    description: 'Full-service supermarket. Open 7am-11pm daily.',
    distance: '3 min walk',
    link: 'https://stores.sainsburys.co.uk/0324'
  },
  {
    id: '9',
    category: 'Groceries',
    name: 'Waitrose & Partners',
    description: 'Premium groceries and essentials. Quality fresh produce and prepared meals.',
    distance: '6 min walk',
    link: 'https://www.waitrose.com'
  },
  {
    id: '10',
    category: 'Activities',
    name: 'Columbia Road Flower Market',
    description: 'Iconic Sunday flower market (8am-3pm). Beautiful blooms at great prices in a vibrant atmosphere.',
    distance: '18 min walk',
    link: 'https://www.columbiaroad.info'
  },
  {
    id: '11',
    category: 'Activities',
    name: 'Shoreditch Park',
    description: 'Hackney\'s largest park with football pitch, tennis courts, BMX track, and public art. Green Flag award winner.',
    distance: '15 min walk',
    link: 'https://hackney.gov.uk/shoreditch-park'
  },
  {
    id: '12',
    category: 'Activities',
    name: 'Museum of the Home',
    description: 'Interactive museum showcasing London home interiors through the ages. Free entry, beautiful gardens.',
    distance: '20 min walk',
    link: 'https://www.museumofthehome.org.uk'
  },
  {
    id: '13',
    category: 'Activities',
    name: 'Brick Lane',
    description: 'Famous for vintage shopping, street art, bagels, and curry houses. Vibrant Sunday market.',
    distance: '12 min walk',
    link: 'https://www.visitlondon.com/things-to-do/place/27795-brick-lane'
  }
];

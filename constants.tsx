
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
  {
    id: '3',
    category: 'Dining',
    name: 'Mem & Laz Brasserie',
    description: 'Bustling venue for Mediterranean mezze and grilled dishes in a rustic setting.',
    distance: '5 min walk',
    link: 'http://memlaz.co.uk'
  },
  {
    id: '4',
    category: 'Activities',
    name: 'O2 Academy Islington',
    description: 'Live music venue hosting regular gigs and club nights throughout the week.',
    distance: '8 min walk',
    link: 'https://www.academymusicgroup.com/o2academyislington'
  },
  {
    id: '5',
    category: 'Transport',
    name: 'Angel Underground Station',
    description: 'Northern Line. Direct links to Bank, London Bridge, and King\'s Cross St Pancras.',
    distance: '9 min walk',
    link: 'https://tfl.gov.uk/tube/stop/940GZZLUAGL'
  },
  {
    id: '6',
    category: 'Transport',
    name: 'Highbury & Islington Station',
    description: 'Victoria Line and Overground. Excellent for West End and East London connections.',
    distance: '10 min walk',
    link: 'https://tfl.gov.uk/tube/stop/940GZZLUHAI'
  },
  {
    id: '7',
    category: 'Transport',
    name: 'Essex Road Station',
    description: 'National Rail services (Great Northern) into Moorgate and Old Street.',
    distance: '8 min walk',
    link: 'https://www.nationalrail.co.uk/stations/essex-road'
  },
  {
    id: '8',
    category: 'Dining',
    name: 'Wingstop',
    description: 'Casual counter-serve chain serving a variety of chicken wings and sides.',
    distance: '10 min walk',
    link: 'https://www.wingstop.co.uk'
  },
  {
    id: '9',
    category: 'Dining',
    name: 'Blank Street Coffee',
    description: 'Modern coffee chain offering high-quality espresso, cold brews, and pastries.',
    distance: '10 min walk',
    link: 'https://www.blankstreet.com'
  },
  {
    id: '10',
    category: 'Groceries',
    name: 'Sainsbury\'s Superstore',
    description: 'Large supermarket with a bakery, deli, and wider selection of groceries.',
    distance: '10 min walk',
    link: 'https://stores.sainsburys.co.uk'
  },
  {
    id: '11',
    category: 'Shopping',
    name: 'Uniqlo',
    description: 'Japanese retailer known for timeless basics, high-quality fabrics, and functional wear.',
    distance: '10 min walk',
    link: 'https://www.uniqlo.com/uk'
  },
  {
    id: '12',
    category: 'Shopping',
    name: 'Office',
    description: 'On-trend shoe store selling own-label and branded footwear for men and women.',
    distance: '10 min walk',
    link: 'https://www.office.co.uk'
  },
  {
    id: '13',
    category: 'Shopping',
    name: 'Argos',
    description: 'Catalogue retailer for technology, home essentials, toys, and more.',
    distance: '10 min walk',
    link: 'https://www.argos.co.uk'
  }
];

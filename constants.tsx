
import { PropertyInfo, ManualSection, Recommendation } from './types';

export const PROPERTY_DATA: PropertyInfo = {
  name: 'The Marylebone Suite',
  address: '15 Chiltern St, London W1U 7PG, United Kingdom',
  wifiName: 'Empires_Luxury_5G',
  wifiPass: 'london-stay-2024',
  checkIn: '3:00 PM',
  checkOut: '11:00 AM',
  emergencyContact: '+44 20 7946 0000'
};

export const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1200&auto=format&fit=crop"
];

export const MANUAL_SECTIONS: ManualSection[] = [
  {
    id: 'check-in',
    title: 'Arrival & Access',
    icon: 'Key',
    content: [
      'The main entrance uses a smart lock. Your unique code is sent via email.',
      'To unlock: Enter code followed by #. The handle will flash green.',
      'Building access after 10 PM requires your key fob located in the kitchen bowl.'
    ]
  },
  {
    id: 'kitchen',
    title: 'Kitchen Appliances',
    icon: 'Utensils',
    content: [
      'Coffee Machine: Nespresso Vertuo. Pods are provided in the drawer.',
      'Induction Hob: Requires magnetic cookware. Tap power then select zone.',
      'Dishwasher: Tablets are under the sink. Use the Eco mode for best results.'
    ]
  },
  {
    id: 'climate',
    title: 'Climate Control',
    icon: 'Thermometer',
    content: [
      'The Nest thermostat is located in the hallway.',
      'Turn the outer ring to adjust temperature.',
      'Underfloor heating in the bathroom is automatic and set to 23°C.'
    ]
  },
  {
    id: 'trash',
    title: 'Waste & Recycling',
    icon: 'Trash2',
    content: [
      'General waste (black bags) goes in the bin outside the kitchen door.',
      'Recycling (clear bags) is collected every Tuesday and Friday morning.',
      'Glass must be taken to the community bin at the end of the street.'
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

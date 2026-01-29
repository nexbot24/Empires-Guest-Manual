
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
    name: 'Chiltern Firehouse',
    description: 'Iconic London dining in a converted fire station. Booking highly recommended.',
    distance: '2 min walk',
    link: 'https://www.chilternfirehouse.com'
  },
  {
    id: '2',
    category: 'Dining',
    name: 'Monocle Café',
    description: 'Minimalist spot for excellent coffee and pastries.',
    distance: '1 min walk',
    link: 'https://cafe.monocle.com'
  },
  {
    id: '3',
    category: 'Transport',
    name: 'Baker Street Station',
    description: 'Jubilee, Bakerloo, Metropolitan, Circle and Hammersmith & City lines.',
    distance: '5 min walk',
    link: '#'
  },
  {
    id: '4',
    category: 'Groceries',
    name: 'Waitrose & Partners',
    description: 'High-quality groceries and essentials.',
    distance: '4 min walk',
    link: '#'
  }
];

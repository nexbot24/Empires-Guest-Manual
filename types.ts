
export enum Tab {
  HOME = 'home',
  GUIDE = 'guide',
  LOCAL = 'local',
  ASSISTANT = 'assistant',
  STORE = 'store'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in pence
  type: 'hourly' | 'fixed';
}

export interface PropertyInfo {
  name: string;
  address: string;
  wifiName: string;
  wifiPass: string;
  checkIn: string;
  checkOut: string;
  emergencyContact: string;
}

export interface ManualSection {
  id: string;
  title: string;
  icon: string;
  content: string[];
}

export interface Recommendation {
  id: string;
  category: 'Dining' | 'Transport' | 'Culture' | 'Groceries' | 'Activities' | 'Shopping';
  name: string;
  description: string;
  distance: string;
  link: string;
}

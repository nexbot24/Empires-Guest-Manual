
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

// Check-in form types
export interface CheckInFormData {
  reservationId: string;
  guestName: string;
  reasonForTrip: string;
  agreedToRules: boolean;
  signatureImage: string;
  signatureDate: string;
}

export interface GuestyReservation {
  _id: string;
  guest?: {
    fullName: string;
  };
  checkIn: string;
  checkOut: string;
  customFields?: {
    'check-in_form_completed'?: boolean;
    'reason_for_trip'?: string;
    'guest_signature'?: string;
    'signature_date'?: string;
    'signature_image'?: string;
  };
}

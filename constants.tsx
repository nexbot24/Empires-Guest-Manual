import { properties } from './config/properties';
import { PropertyInfo, ManualSection, Recommendation } from './types';

// Get property ID from environment variable, default to 'haven' for development safety
const PROPERTY_ID = import.meta.env.VITE_PROPERTY_ID || 'haven';

const config = properties[PROPERTY_ID];

if (!config) {
  throw new Error(`Property configuration not found for ID: ${PROPERTY_ID}. Available properties: ${Object.keys(properties).join(', ')}`);
}

export const PROPERTY_DATA: PropertyInfo = config.data;
export const GALLERY_IMAGES: string[] = config.galleryImages;
export const MANUAL_SECTIONS: ManualSection[] = config.manualSections;
export const RECOMMENDATIONS: Recommendation[] = config.recommendations;


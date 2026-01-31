
import { GoogleGenAI } from "@google/genai";
import { PROPERTY_DATA, MANUAL_SECTIONS, RECOMMENDATIONS } from "../constants";

export const askAssistant = async (question: string) => {
  // @ts-ignore - Vite env variables
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY || "";

  if (!apiKey) {
    return "I'm sorry, the AI Host is not configured yet. Please contact support for assistance.";
  }

  const ai = new GoogleGenAI({ apiKey });

  const manualContext = MANUAL_SECTIONS.map(s => `${s.title}: ${s.content.join(' ')}`).join('\n');
  const recommendationContext = RECOMMENDATIONS.map(r => `${r.name} (${r.category}): ${r.description} - ${r.distance}`).join('\n');

  const propertyContext = `
    Property: ${PROPERTY_DATA.name}
    Address: ${PROPERTY_DATA.address}
    Wifi: ${PROPERTY_DATA.wifiName} (Password: ${PROPERTY_DATA.wifiPass})
    Check-in: ${PROPERTY_DATA.checkIn}
    Check-out: ${PROPERTY_DATA.checkOut}
  `;

  const systemInstruction = `
    You are the "Empires Property Virtual Concierge". 
    Tone: Friendly, bright, and helpful, but NOT chatty. Be concise.
    
    CRITICAL INSTRUCTION FOR WIFI:
    If the user asks about WiFi, internet, or password, ONLY reply with the Network Name and Password. Do not add any greeting or extra text.
    
    Your Knowledge Base:
    ${propertyContext}
    
    Property Manual:
    ${manualContext}
    
    Local Recommendations:
    ${recommendationContext}
    
    If the user asks something not in this context, politely say you don't know and suggest contacting support at ${PROPERTY_DATA.emergencyContact}.
    Keep responses short and perfect for reading on a mobile phone.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: question,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm sorry, I'm having trouble connecting right now. Please try again or contact our emergency support line.";
  }
};

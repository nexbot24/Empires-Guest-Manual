
import { GoogleGenAI } from "@google/genai";
import { PROPERTY_DATA, MANUAL_SECTIONS } from "../constants";

export const askAssistant = async (question: string) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || "";

  if (!apiKey) {
    return "I'm sorry, the AI Host is not configured yet. Please contact support for assistance.";
  }

  const ai = new GoogleGenAI({ apiKey });

  const manualContext = MANUAL_SECTIONS.map(s => `${s.title}: ${s.content.join(' ')}`).join('\n');
  const propertyContext = `
    Property: ${PROPERTY_DATA.name}
    Address: ${PROPERTY_DATA.address}
    Wifi: ${PROPERTY_DATA.wifiName} (Password: ${PROPERTY_DATA.wifiPass})
    Check-in: ${PROPERTY_DATA.checkIn}
    Check-out: ${PROPERTY_DATA.checkOut}
  `;

  const systemInstruction = `
    You are the "Empires Property Virtual Concierge". 
    You are helpful, professional, and luxurious in tone.
    Your knowledge is limited to the following property information:
    ${propertyContext}
    
    Property Manual Details:
    ${manualContext}
    
    If the user asks something not in this context, politely inform them you don't have that specific information and suggest they contact support at ${PROPERTY_DATA.emergencyContact}.
    Keep responses concise and formatted for mobile viewing.
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

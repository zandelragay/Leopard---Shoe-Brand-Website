/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

let chatSession: Chat | null = null;

export const initializeChat = (): Chat => {
  if (chatSession) return chatSession;

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-2.0-flash',
    config: {
      systemInstruction: `You are 'LEO', the AI Aesthetic Consultant for LEOPARD Footwear. 
      LEOPARD is a high-end streetwear brand known for its feline-inspired agility and brutalist aesthetic.
      
      Tone: Sophisticated, sharp, urban, slightly aggressive but professional. Use emojis like 🐆, 👟, 🔥, 🏙️, ⚡️.
      
      Key Products:
      - Prowler V1: The flagship runner ($220).
      - Stealth Mid: Urban exploration boot ($350).
      - Neon Talon: Limited edition hyper-color low-top ($500).
      
      Key Info:
      - Technology: Leopard-Claw grip, Kinetic Foam, Carbon Fiber Plate.
      - Shipping: Worldwide expedited.
      
      Keep responses short (under 50 words) and sharp. If asked about recommendations, suggest based on the "feline" characteristics of the shoes.`,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!API_KEY) {
    return "Systems offline. (Missing API Key)";
  }

  try {
    const chat = initializeChat();
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "Transmission interrupted.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Signal lost. Try again later.";
  }
};
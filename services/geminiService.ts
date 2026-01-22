
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Initialize the client lazily to prevent crashes on initial load if env vars are missing in browser context.
let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const getAIClient = () => {
  if (!ai) {
    // Ensure we are accessing process.env.API_KEY safely. 
    // The index.html polyfill ensures process exists, preventing ReferenceError.
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }
  return ai;
};

const SYSTEM_INSTRUCTION = `
You are the digital assistant for Derek Lane's portfolio website.
Your tone is sophisticated, minimalist, professional, yet slightly witty and avant-garde.
You are here to answer visitors' questions about the Creative Director's work, services, and design philosophy.

Key Facts about Derek:
- Name: Derek Lane (The Creative Director)
- Specializes in: Brand Identity, Digital Product Design, and Spatial Experiences.
- Philosophy: "Clarity is the ultimate luxury."
- Availability: Currently connecting for future leadership opportunities and select collaborations.
- Contact: Can be reached via the contact form below.

Guidelines:
- Keep responses concise and punchy (under 50 words usually).
- Use design terminology correctly but accessibly.
- If asked for a quote, refer them to the contact form for a proper consultation.
- Be helpful but maintain an air of professional confidence.
`;

export const getChatSession = (): Chat => {
  if (!chatSession) {
    const client = getAIClient();
    chatSession = client.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<AsyncIterable<GenerateContentResponse>> => {
  const chat = getChatSession();
  // Return the stream directly
  return chat.sendMessageStream({ message });
};

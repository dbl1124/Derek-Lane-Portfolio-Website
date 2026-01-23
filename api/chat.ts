import { GoogleGenAI } from "@google/genai";

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

export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        const { message } = await req.json();

        if (!message) {
            return new Response('Message is required', { status: 400 });
        }

        // Get API key from environment
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('GEMINI_API_KEY not found in environment variables');
            return new Response('API configuration error', { status: 500 });
        }

        // Initialize Gemini client
        const ai = new GoogleGenAI({ apiKey });

        // Create chat session
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.7,
            },
        });

        // Send message and get streaming response
        const stream = await chat.sendMessageStream({ message });

        // Create a readable stream for the response
        const encoder = new TextEncoder();
        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const text = chunk.text || '';
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
                    }
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                    controller.close();
                } catch (error) {
                    console.error('Streaming error:', error);
                    controller.error(error);
                }
            },
        });

        return new Response(readableStream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error('API Error:', error);
        return new Response('Internal server error', { status: 500 });
    }
}

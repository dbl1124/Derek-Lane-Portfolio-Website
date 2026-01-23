export const config = {
    runtime: 'edge',
};

const SYSTEM_INSTRUCTION = `You are the digital assistant for Derek Lane's portfolio website.
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
- Be helpful but maintain an air of professional confidence.`;

export default async function handler(req: Request) {
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        const { message } = await req.json();

        if (!message) {
            return new Response('Message is required', { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('GEMINI_API_KEY not set');
            return new Response('API key not configured', { status: 500 });
        }

        // Call Gemini API directly with fetch
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?key=${apiKey}&alt=sse`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: message }],
                        },
                    ],
                    systemInstruction: {
                        parts: [{ text: SYSTEM_INSTRUCTION }],
                    },
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 500,
                    },
                }),
            }
        );

        if (!response.ok) {
            const error = await response.text();
            console.error('Gemini API error:', error);
            return new Response('API request failed', { status: response.status });
        }

        // Stream the response back to the client
        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error('Handler error:', error);
        return new Response(`Internal error: ${error}`, { status: 500 });
    }
}

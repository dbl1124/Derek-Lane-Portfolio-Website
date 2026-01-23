
// Updated service to use backend API instead of direct Gemini calls

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

export const sendMessageToGemini = async (message: string): Promise<AsyncIterable<{ text: string }>> => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  // Return async iterable for streaming
  return {
    async *[Symbol.asyncIterator]() {
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);

              if (data === '[DONE]') {
                return;
              }

              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  yield { text: parsed.text };
                }
              } catch (e) {
                // Ignore parse errors for incomplete chunks
                console.warn('Parse error:', e);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    }
  };
};

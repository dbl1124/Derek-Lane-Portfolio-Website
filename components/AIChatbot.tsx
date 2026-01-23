import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello. I'm Derek's AI Assistant. Ask me anything about his work or philosophy." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Initial empty message for streaming
      setMessages(prev => [...prev, { role: 'model', text: '', isStreaming: true }]);

      const stream = await sendMessageToGemini(userMessage);

      let fullText = '';

      for await (const chunk of stream) {
        const textChunk = chunk.text || '';
        fullText += textChunk;

        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg.role === 'model' && lastMsg.isStreaming) {
            lastMsg.text = fullText;
          }
          return newMessages;
        });
      }

      // Finalize
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];
        if (lastMsg.role === 'model') {
          lastMsg.isStreaming = false;
        }
        return newMessages;
      });

    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm temporarily offline for maintenance. Please try the contact form." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] glass-panel rounded-2xl z-50 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-brand-accent" />
                <span className="font-bold text-white text-sm tracking-wide">AI Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`
                            max-w-[80%] p-3 rounded-lg text-sm leading-relaxed
                            ${msg.role === 'user'
                      ? 'bg-white text-black rounded-br-none'
                      : 'bg-white/10 text-white rounded-bl-none border border-white/5'}
                        `}>
                    {msg.text}
                    {msg.isStreaming && <span className="inline-block w-1 h-3 ml-1 bg-brand-accent animate-pulse" />}
                  </div>
                </div>
              ))}
              {isLoading && !messages[messages.length - 1].isStreaming && (
                <div className="flex justify-start">
                  <div className="bg-white/10 p-3 rounded-lg rounded-bl-none w-12 flex justify-center">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-black/40">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about projects, style..."
                  className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-brand-accent rounded-full text-black hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand-accent rounded-full flex items-center justify-center shadow-lg shadow-brand-accent/20 z-50 text-black group"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} className="group-hover:animate-pulse" />}
      </motion.button>
    </>
  );
};

export default AIChatbot;

import React, { useState } from 'react';
import { Lock, Check, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminPanel from './AdminPanel';
import { useContent } from '../contexts/ContentContext';

const Contact: React.FC = () => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const { generalContent } = useContent();
  
  // Form Logic
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');

    // ---------------------------------------------------------
    // CONFIGURATION
    // Create a form at https://formspree.io and paste ID here.
    // ---------------------------------------------------------
    const FORMSPREE_ID: string = 'mgvqvkak'; // Replace with your specific ID

    // Validation to prevent confusion
    if (!FORMSPREE_ID || FORMSPREE_ID === 'YOUR_FORM_ID') {
        alert("The Contact Form ID has not been configured yet. Please update the 'FORMSPREE_ID' variable in Contact.tsx.");
        setIsSubmitting(false);
        return;
    }

    try {
        const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: formState.name,
                email: formState.email,
                message: formState.message
            })
        });

        if (response.ok) {
            setStatus('success');
            setFormState({ name: '', email: '', message: '' });
        } else {
            setStatus('error');
            const data = await response.json();
            console.error("Formspree Error:", data);
        }
    } catch (error) {
        console.error("Network Error:", error);
        setStatus('error');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState(prev => ({
          ...prev,
          [e.target.name]: e.target.value
      }));
  };

  return (
    <footer id="contact" className="bg-brand-dark text-white pt-32 pb-10 border-t border-white/10 relative z-10 overflow-hidden">
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
      
      <div className="max-w-7xl mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between gap-16">
        
        <motion.div 
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8 }}
        >
            <h2 className="text-6xl md:text-8xl font-display font-bold mb-8 whitespace-pre-line">
               {generalContent.contact.title}
            </h2>
            <p className="text-white/60 text-xl max-w-md mb-12">
                {generalContent.contact.description}
            </p>
        </motion.div>

        <motion.div 
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            <div className="relative min-h-[450px]">
                <AnimatePresence mode="wait">
                    {status === 'success' ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-center p-8 backdrop-blur-sm"
                        >
                            <div className="w-20 h-20 bg-brand-accent rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,251,121,0.3)]">
                                <Check size={40} className="text-black" />
                            </div>
                            <h3 className="text-3xl font-display font-bold text-white mb-4">Message Sent</h3>
                            <p className="text-white/60 text-lg max-w-xs">
                                Thank you for reaching out. I'll be in touch shortly.
                            </p>
                            <button 
                                onClick={() => setStatus('idle')}
                                className="mt-8 text-brand-accent text-sm uppercase tracking-widest hover:text-white transition-colors"
                            >
                                Send Another
                            </button>
                        </motion.div>
                    ) : (
                        <motion.form 
                            key="form"
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-8"
                        >
                            {status === 'error' && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-lg flex items-center gap-3">
                                    <AlertCircle size={18} />
                                    <p className="text-sm">Something went wrong. Please try again later.</p>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-white/50">Name</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={formState.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-transparent border-b border-white/20 py-4 focus:outline-none focus:border-brand-accent transition-colors text-white" 
                                        placeholder="Jane Smith" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-widest text-white/50">Email</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formState.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-transparent border-b border-white/20 py-4 focus:outline-none focus:border-brand-accent transition-colors text-white" 
                                        placeholder="jane@example.com" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/50">Message</label>
                                <textarea 
                                    name="message"
                                    value={formState.message}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-transparent border-b border-white/20 py-4 h-32 focus:outline-none focus:border-brand-accent transition-colors resize-none text-white" 
                                    placeholder="Say hello..."
                                ></textarea>
                            </div>
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-brand-accent transition-all w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" size={18} />
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    "Send Message"
                                )}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>

      </div>
      
      {/* Footer bottom content */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 mt-32 flex flex-col md:flex-row justify-between items-center text-white/30 text-sm">
        <p>&copy; {new Date().getFullYear()} Derek Lane. All rights reserved.</p>
        <div className="flex items-center space-x-8 mt-4 md:mt-0">
            <button onClick={() => setIsAdminOpen(true)} className="text-white/10 hover:text-brand-accent transition-colors">
                <Lock size={14} />
            </button>
        </div>
      </div>
    </footer>
  );
};

export default Contact;

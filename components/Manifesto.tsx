
import React from 'react';
import { useContent } from '../contexts/ContentContext';
import { motion } from 'framer-motion';

const Manifesto: React.FC = () => {
  const { generalContent } = useContent();
  
  return (
    <section id="manifesto" className="py-32 bg-brand-dark relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-16 flex flex-col items-center">
        
        {/* Wrapper to align Label with Quote while keeping both centered on page but text left-aligned */}
        <div className="w-full max-w-4xl">
            <h2 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-12 text-left">
                {generalContent.manifesto.label}
            </h2>
            
            <div className="relative w-full">
                <div className="absolute -top-12 -left-4 md:-left-12 text-9xl text-white/5 font-display font-bold leading-none select-none">“</div>
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{ duration: 0.8 }}
                  className="relative z-10"
                >
                   <p className="text-2xl md:text-[2.6rem] md:leading-tight font-display font-medium text-white text-left">
                    {generalContent.manifesto.content.split('\n').map((line, i) => (
                        <span key={i} className="block mb-2 md:mb-4">{line}</span>
                    ))}
                   </p>
                </motion.div>
            </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-12 w-full">
            {generalContent.manifesto.items.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{ delay: idx * 0.2 }}
                  className="text-left"
                >
                    <span className="text-brand-accent font-display text-xl mb-4 block">{item.number}</span>
                    <h3 className="text-white text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-lg text-white/50">{item.desc}</p>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Manifesto;


import React, { useState, useEffect } from 'react';
import { useContent } from '../contexts/ContentContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const Capabilities: React.FC = () => {
  const { capabilities, generalContent } = useContent();
  // Safe default for active category in case capabilities is empty or loading, though Context provides initial values
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (capabilities.length > 0 && !activeCategory) {
        setActiveCategory(capabilities[0].category);
    }
  }, [capabilities, activeCategory]);

  // Reset expansion when category changes
  useEffect(() => {
    setExpandedIndex(null);
  }, [activeCategory]);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="capabilities" className="py-32 bg-neutral-900 relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.6 }}
        >
             <h2 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-4">{generalContent.services.label}</h2>
             <h3 className="text-4xl md:text-6xl font-display font-bold text-white">{generalContent.services.title}</h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Category Selector */}
            <motion.div 
                className="md:col-span-4 flex flex-col space-y-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                {capabilities.map((cap) => (
                    <button
                        key={cap.category}
                        onClick={() => setActiveCategory(cap.category)}
                        className={`
                            text-left text-2xl md:text-4xl font-display font-bold transition-all duration-300
                            ${activeCategory === cap.category ? 'text-white pl-4 border-l-4 border-brand-accent' : 'text-white/30 hover:text-white/60 pl-0 border-l-4 border-transparent'}
                        `}
                    >
                        {cap.category}
                    </button>
                ))}
            </motion.div>

            {/* Detailed List */}
            <div className="md:col-span-8">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4 }}
                        className="grid grid-cols-1 gap-4"
                    >
                        {capabilities.find(c => c.category === activeCategory)?.items.map((item, idx) => {
                            const isExpanded = expandedIndex === idx;
                            return (
                                <div 
                                    key={idx} 
                                    onClick={() => toggleExpand(idx)}
                                    className={`
                                        group border-b border-white/10 pb-6 cursor-pointer transition-colors
                                        ${isExpanded ? 'border-brand-accent' : 'hover:border-white/30'}
                                    `}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xl transition-colors font-medium ${isExpanded ? 'text-brand-accent' : 'text-white/80 group-hover:text-white'}`}>
                                            {item.title}
                                        </span>
                                        <div className={`
                                            transition-all duration-300 
                                            ${isExpanded ? 'text-brand-accent opacity-100' : 'text-white/30 opacity-50 group-hover:text-white group-hover:opacity-100'}
                                        `}>
                                            {isExpanded ? <Minus /> : <Plus />}
                                        </div>
                                    </div>
                                    
                                    <motion.div
                                        initial={false}
                                        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <p className="pt-4 text-lg text-white/50 leading-relaxed max-w-2xl">
                                            {item.description}
                                        </p>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Capabilities;

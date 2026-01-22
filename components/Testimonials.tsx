
import React, { useRef, useState, useEffect } from 'react';
import { useContent } from '../contexts/ContentContext';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import SmartImage from './SmartImage';

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        // Changed to 767px so tablet (768+) uses desktop interactions since layout is side-by-side
        const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 767px)").matches);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);
    return isMobile;
};

interface TestimonialCardProps {
    t: any;
    index: number;
    isActive: boolean;
    isMobile: boolean;
    forwardRef: React.Ref<HTMLDivElement>;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ t, index, isActive, isMobile, forwardRef }) => {
    // Active state logic
    const isHighlighted = isMobile ? isActive : false; // Desktop handles via hover group logic below

    const bgClass = isMobile 
        ? (isHighlighted ? "bg-white/10" : "bg-white/5")
        : "bg-white/5 hover:bg-white/10";

    const borderClass = isMobile
        ? (isHighlighted ? "border-white/20" : "border-white/5")
        : "border-white/5 hover:border-white/20";

    return (
        <motion.div 
            ref={forwardRef}
            className={`p-10 rounded-2xl transition-colors duration-500 border ${bgClass} ${borderClass}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
        >
            <Quote className="text-brand-accent mb-6 w-8 h-8 opacity-50" />
            <p className="text-2xl text-white/90 italic mb-8 leading-relaxed">"{t.content}"</p>
            <div className="flex items-center space-x-4">
                <SmartImage src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full grayscale" />
                <div>
                    <h4 className="text-white font-bold">{t.name}</h4>
                    <p className="text-brand-accent text-sm">{t.role}, {t.company}</p>
                </div>
            </div>
        </motion.div>
    );
};

const Testimonials: React.FC = () => {
  const { testimonials, generalContent } = useContent();
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Distance-Based Scroll Spy
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
        const centerLine = window.innerHeight / 2;
        let closestIndex = -1;
        let minDistance = Number.MAX_VALUE;
        const threshold = window.innerHeight * 0.4; 

        itemRefs.current.forEach((el, index) => {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const elCenter = rect.top + (rect.height / 2);
            const distance = Math.abs(centerLine - elCenter);

            if (distance < minDistance && distance < threshold) {
                minDistance = distance;
                closestIndex = index;
            }
        });

        setActiveIndex(closestIndex !== -1 ? closestIndex : null);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, testimonials]);

  return (
    <section className="py-32 bg-brand-dark relative z-10 overflow-hidden">
        {/* Decorator */}
        <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 md:px-16">
            <motion.div 
                className="text-center mb-20"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-4xl font-display font-bold text-white">{generalContent.testimonials.title}</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((t, index) => (
                    <TestimonialCard 
                        key={t.id} 
                        t={t} 
                        index={index}
                        isMobile={isMobile}
                        isActive={activeIndex === index}
                        forwardRef={(el) => { itemRefs.current[index] = el; }}
                    />
                ))}
            </div>
        </div>
    </section>
  );
};

export default Testimonials;
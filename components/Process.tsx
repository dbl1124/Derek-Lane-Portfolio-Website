
import React, { useRef, useState, useEffect } from 'react';
import { useContent } from '../contexts/ContentContext';
import { motion } from 'framer-motion';

// Helper hook for mobile detection
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        // Changed to 767px so tablet (768+) uses desktop hover interactions since layout is side-by-side
        const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 767px)").matches);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);
    return isMobile;
};

interface ProcessStepItemProps {
    step: any;
    index: number;
    isActive: boolean;
    isMobile: boolean;
    forwardRef: React.Ref<HTMLDivElement>;
}

const ProcessStepItem: React.FC<ProcessStepItemProps> = ({ step, index, isActive, isMobile, forwardRef }) => {
    // Active state logic:
    // Mobile (< 768px): Controlled by parent passed 'isActive' prop (Distance calculation)
    // Tablet/Desktop (>= 768px): Controlled by CSS hover (group-hover)
    
    const activeClass = isMobile 
        ? (isActive ? "border-brand-accent/50" : "border-white/10") 
        : "border-white/10 hover:border-brand-accent/50";

    const numberOpacity = isMobile 
        ? (isActive ? "opacity-100" : "opacity-20") 
        : "opacity-20 group-hover:opacity-100";

    const titleColor = isMobile 
        ? (isActive ? "text-brand-accent" : "text-white") 
        : "text-white group-hover:text-brand-accent";

    const barWidth = isMobile 
        ? (isActive ? "w-full" : "w-0") 
        : "w-0 group-hover:w-full";

    return (
        <motion.div 
            ref={forwardRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ delay: index * 0.1 }}
            className={`group relative p-8 md:p-12 border transition-colors duration-500 ${activeClass}`}
        >
            <div className={`absolute top-0 right-0 p-4 transition-opacity duration-500 ${numberOpacity}`}>
                <span className="text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-transparent">
                    0{step.id}
                </span>
            </div>
            
            <div className="relative z-10">
                <h4 className={`text-2xl font-display font-bold mb-4 transition-colors ${titleColor}`}>
                    {/* 
                        Split text by newline char. 
                        Render a <br/> that is HIDDEN on large desktop (lg:hidden) and VISIBLE on mobile/tablet (below 1024px).
                        Add a space that is VISIBLE on large desktop (hidden lg:inline) to replace the break.
                    */}
                    {step.title.split('\n').map((part: string, i: number, arr: string[]) => (
                        <React.Fragment key={i}>
                            {part}
                            {i < arr.length - 1 && (
                                <>
                                    <br className="lg:hidden" />
                                    <span className="hidden lg:inline"> </span>
                                </>
                            )}
                        </React.Fragment>
                    ))}
                </h4>
                <p className="text-xl text-white/60 leading-relaxed">
                    {step.description}
                </p>
            </div>
            
            <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-brand-accent to-brand-secondary transition-all duration-700 ease-out ${barWidth}`} />
        </motion.div>
    );
};

const Process: React.FC = () => {
  const { processSteps, generalContent } = useContent();
  const isMobile = useIsMobile();
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Distance-Based Scroll Spy
  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
        const centerLine = window.innerHeight / 2;
        let closestIndex = -1;
        let minDistance = Number.MAX_VALUE;
        const threshold = window.innerHeight * 0.4; // Item must be within 40% of center to activate

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

        setActiveStepIndex(closestIndex !== -1 ? closestIndex : null);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, processSteps]);


  return (
    <section id="process" className="py-32 bg-brand-dark relative z-30">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <div className="mb-20 border-b border-white/10 pb-8 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 md:gap-8 xl:gap-20">
            <div>
                <h2 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-4">{generalContent.process.label}</h2>
                <h3 className="text-4xl md:text-6xl font-display font-bold text-white">
                    {generalContent.process.title}
                </h3>
            </div>
            <p className="text-lg text-white/50 max-w-md mt-0">
                {generalContent.process.description}
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {processSteps.map((step, index) => (
                <ProcessStepItem 
                    key={step.id} 
                    step={step} 
                    index={index}
                    isMobile={isMobile}
                    isActive={activeStepIndex === index}
                    forwardRef={(el) => { itemRefs.current[index] = el; }}
                />
            ))}
        </div>
      </div>
    </section>
  );
};

export default Process;

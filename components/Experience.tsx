
import React, { useRef, useState, useEffect } from 'react';
import { useContent } from '../contexts/ContentContext';
import { motion } from 'framer-motion';

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.matchMedia("(max-width: 1024px)").matches);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);
    return isMobile;
};

interface ExperienceItemCardProps {
    job: any;
    index: number;
    dotPositionClass: string;
    isActive: boolean;
    isMobile: boolean;
    forwardRef: React.Ref<HTMLDivElement>;
}

const ExperienceItemCard: React.FC<ExperienceItemCardProps> = ({ job, index, dotPositionClass, isActive, isMobile, forwardRef }) => {
    // Conditional styling logic
    const borderClass = isMobile 
        ? (isActive ? "border-brand-accent" : "border-white/10")
        : "border-white/10 hover:border-brand-accent";

    const titleClass = isMobile
        ? (isActive ? "text-brand-accent" : "text-white")
        : "text-white group-hover:text-brand-accent";
    
    // Dot logic
    const baseDot = "absolute -left-[5px] w-2.5 h-2.5 rounded-full bg-brand-dark border transition-all duration-300";
    const inactiveDot = "border-white/30";
    
    // Mobile Active Dot
    const activeDotMobile = isActive 
        ? "border-brand-accent bg-brand-accent shadow-[0_0_10px_rgba(212,251,121,0.5)]" 
        : inactiveDot;
        
    // Desktop Hover Dot
    const hoverDotDesktop = "group-hover:border-brand-accent group-hover:bg-brand-accent group-hover:shadow-[0_0_10px_rgba(212,251,121,0.5)]";

    const dotStyle = isMobile ? activeDotMobile : `${inactiveDot} ${hoverDotDesktop}`;

    return (
        <motion.div 
            ref={forwardRef}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ delay: index * 0.2 }}
            className={`group relative pl-8 border-l transition-colors duration-500 pb-2 ${borderClass}`}
        >
            {/* Dynamic Dot Position */}
            <div className={`${baseDot} ${dotStyle} ${dotPositionClass}`} />
            
            <span className="text-white/40 font-mono text-sm mb-2 block">{job.period}</span>
            <h3 className={`text-2xl font-display font-bold mb-1 transition-colors ${titleClass}`}>{job.role}</h3>
            <h4 className="text-lg text-white/70 mb-4">{job.company}</h4>
            <p className="text-lg text-white/50 leading-relaxed max-w-xl">
                {job.description}
            </p>
        </motion.div>
    );
}

const Experience: React.FC = () => {
  const { experience, education, generalContent } = useContent();
  const isMobile = useIsMobile();
  const [activeJobIndex, setActiveJobIndex] = useState<number | null>(null);
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

        setActiveJobIndex(closestIndex !== -1 ? closestIndex : null);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, experience]);

  return (
    <section id="experience" className="py-32 bg-neutral-900 relative z-10 overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Career Timeline */}
        <div className="lg:col-span-7">
            <h2 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-12">{generalContent.experience.label}</h2>
            
            <div className="space-y-12">
                {experience.map((job, index) => {
                    // Determine dot positioning
                    let dotPositionClass = "top-2"; 
                    if (experience.length > 1) {
                         if (index === experience.length - 1) {
                            dotPositionClass = "bottom-0 top-auto translate-y-1/2"; 
                         } else if (index > 0) {
                            dotPositionClass = "top-1/2 -translate-y-1/2"; 
                         }
                    }

                    return (
                        <ExperienceItemCard 
                            key={job.id} 
                            job={job} 
                            index={index} 
                            dotPositionClass={dotPositionClass}
                            isMobile={isMobile}
                            isActive={activeJobIndex === index}
                            forwardRef={(el) => { itemRefs.current[index] = el; }}
                        />
                    );
                })}
            </div>
        </div>

        {/* Education Section */}
        <div className="lg:col-span-5">
            <h2 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-12">{generalContent.experience.educationLabel}</h2>
            
            <div className="grid grid-cols-1 gap-0 border-t border-white/10">
                {education.map((edu, index) => (
                    <motion.div 
                        key={edu.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-20%" }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        className="group py-6 border-b border-white/10 flex justify-between items-center hover:bg-white/5 px-4 -mx-4 transition-colors cursor-default"
                    >
                        <div>
                            <h4 className="text-white font-bold group-hover:text-brand-accent transition-colors">{edu.degree}</h4>
                            <p className="text-sm text-white/40 mt-1">{edu.institution}</p>
                        </div>
                        <span className="text-white/20 font-display font-bold">{edu.year}</span>
                    </motion.div>
                ))}
            </div>
            
            <div className="mt-12 p-6 bg-white/5 rounded-xl border border-white/5 text-center">
                <p className="text-white/60 text-base mb-4 whitespace-pre-line">
                    "{generalContent.experience.educationQuote}"
                </p>
                <a 
                    href="/derek_lane_resume.pdf" 
                    download="derek_lane_resume.pdf"
                    className="inline-block text-brand-accent text-xs uppercase tracking-widest border-b border-brand-accent/30 hover:border-brand-accent pb-1 transition-all cursor-pointer"
                >
                    Download Full Resume
                </a>
            </div>
        </div>

      </div>
    </section>
  );
};

export default Experience;
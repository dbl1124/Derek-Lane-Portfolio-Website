
import React, { useRef, useState, useEffect } from 'react';
import { useContent } from '../contexts/ContentContext';
import { Project } from '../types';
import { ArrowUpRight, X, Play } from 'lucide-react';
import { motion, useScroll, useTransform, MotionValue, AnimatePresence, useInView, useMotionValueEvent } from 'framer-motion';
import SmartImage from './SmartImage';
import SmartVideo from './SmartVideo';

// Hook to detect mobile/tablet devices
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

interface DesktopCardProps {
  project: Project;
  index: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  onSelect: (project: Project) => void;
}

const DesktopCard: React.FC<DesktopCardProps> = ({ project, index, progress, range, targetScale, onSelect }) => {
  const container = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scale = useTransform(progress, range, [1, targetScale]);
  const isHex = project.color.startsWith('#') || project.color.startsWith('rgb');

  useEffect(() => {
    if (videoRef.current) {
      // Only play video if project has one and is hovered
      if (isHovered && project.video) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      } else if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [isHovered, project.video]);

  return (
    <div ref={container} className="h-screen sticky top-0 z-0 flex items-center justify-center">
        <motion.div style={{ scale }} className="w-full flex justify-center items-center transform-gpu">
            <motion.div
                layoutId={`card-container-${project.id}`}
                onClick={() => onSelect(project)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
                    relative w-full h-[80vh] md:max-w-7xl rounded-3xl overflow-hidden shadow-2xl flex flex-row
                    ${!isHex ? project.color : ''} cursor-pointer group
                `}
                style={{ backgroundColor: isHex ? project.color : undefined }}
            >
                {/* Image Section - REMOVED layoutId from image to prevent distortion */}
                <div className="w-1/2 h-full relative overflow-hidden">
                    <SmartImage 
                        src={project.image} 
                        alt={project.title} 
                        // Use Framer animate for scale. SmartImage now handles this via motion.img
                        animate={{ scale: isHovered ? 1.1 : 1 }}
                        transition={{ duration: 0.7 }}
                        className="w-full h-full object-cover"
                    />
                    {project.video && (
                        <SmartVideo
                            ref={videoRef}
                            src={project.video}
                            muted loop playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isHovered ? 1 : 0 }}
                            transition={{ duration: 0.5 }}
                        />
                    )}
                    <div className={`absolute inset-0 bg-black/20 transition-colors duration-500 pointer-events-none ${isHovered ? 'bg-transparent' : ''}`} />
                </div>

                {/* Content Section */}
                <div className="w-1/2 h-full p-12 flex flex-col justify-between text-white bg-brand-dark/90 backdrop-blur-xl">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <motion.span layoutId={`card-category-${project.id}`} className="px-3 py-1 rounded-full border border-white/20 text-xs uppercase tracking-widest bg-white/5">
                                {project.category}
                            </motion.span>
                            <motion.span layoutId={`card-year-${project.id}`} className="text-white/40 font-display font-bold">
                                {project.year}
                            </motion.span>
                        </div>
                        <motion.h3 layoutId={`card-title-${project.id}`} className="text-5xl font-display font-bold mb-6 leading-snug break-words">
                            {project.title}
                        </motion.h3>
                        <motion.p layoutId={`card-desc-${project.id}`} className="text-white/70 text-xl leading-relaxed line-clamp-3">
                            {project.description}
                        </motion.p>
                    </div>
                    <div className="flex items-center space-x-3 text-white font-medium">
                        <span className={`uppercase tracking-widest text-sm transition-colors ${isHovered ? 'text-brand-accent' : ''}`}>View Case Study</span>
                        <div className={`w-10 h-10 rounded-full border border-white/30 flex items-center justify-center transition-all duration-300 ${isHovered ? 'bg-brand-accent border-brand-accent text-brand-dark' : ''}`}>
                            <ArrowUpRight size={18} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    </div>
  );
};

const MobileCard: React.FC<{ project: Project; index: number; total: number; onSelect: (p: Project) => void }> = ({ project, index, total, onSelect }) => {
    const isHex = project.color.startsWith('#') || project.color.startsWith('rgb');
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { amount: 0.6 });
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && project.video) {
            if (isInView) {
                videoRef.current.play().catch(() => {});
            } else {
                videoRef.current.pause();
            }
        }
    }, [isInView, project.video]);

    return (
        <div ref={containerRef} className="sticky top-0 h-[100svh] w-full flex items-center justify-center px-4" style={{ zIndex: index + 1 }}>
             <motion.div 
                layoutId={`card-container-${project.id}`}
                onClick={() => onSelect(project)}
                className={`
                    relative w-full max-w-md md:max-w-none md:w-[80vw] h-[75svh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-white/10
                    ${!isHex ? project.color : ''}
                `}
                style={{ backgroundColor: isHex ? project.color : undefined }}
            >
                 {/* Mobile Image - REMOVED layoutId from image */}
                 <div className="h-1/2 relative overflow-hidden">
                    <SmartImage 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover" 
                    />
                    {project.video && (
                        <SmartVideo ref={videoRef} src={project.video} muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-black/10" />
                    
                    {/* Index Badge */}
                    <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 z-10">
                        <span className="text-brand-accent text-xs font-bold font-mono">
                            {(index + 1).toString().padStart(2, '0')} / {(total || 0).toString().padStart(2, '0')}
                        </span>
                    </div>
                 </div>

                 {/* Mobile Content */}
                 <div className="h-1/2 p-6 md:p-8 flex flex-col justify-between bg-brand-dark/90 backdrop-blur-xl border-t border-white/5">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <motion.span layoutId={`card-category-${project.id}`} className="px-3 py-1 rounded-full border border-white/20 text-[10px] uppercase tracking-widest bg-white/5 text-white/80">
                                {project.category}
                            </motion.span>
                            <motion.span layoutId={`card-year-${project.id}`} className="text-white/40 font-display font-bold text-sm">
                                {project.year}
                            </motion.span>
                        </div>
                        <motion.h3 layoutId={`card-title-${project.id}`} className="text-3xl font-display font-bold text-white mb-4 leading-none">
                            {project.title}
                        </motion.h3>
                        <motion.p layoutId={`card-desc-${project.id}`} className="text-white/60 text-base leading-relaxed line-clamp-3">
                            {project.description}
                        </motion.p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                        <span className="uppercase tracking-widest text-xs text-white hover:text-brand-accent transition-colors font-medium">View Case Study</span>
                        <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center bg-transparent text-white">
                            <ArrowUpRight size={18} />
                        </div>
                    </div>
                 </div>
            </motion.div>
        </div>
    )
}

const ModalVideoPlayer: React.FC<{ src: string }> = ({ src }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
  
    const togglePlay = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };
  
    return (
      <div className="w-full rounded-2xl overflow-hidden border border-white/5 aspect-video relative shadow-2xl group cursor-pointer bg-black" onClick={togglePlay}>
          <SmartVideo
              ref={videoRef}
              src={src}
              muted={false} 
              loop
              playsInline
              className="w-full h-full object-cover"
              onEnded={() => setIsPlaying(false)}
          />
          <AnimatePresence>
              {!isPlaying && (
                  <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-colors backdrop-blur-sm"
                  >
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                          <Play fill="white" className="text-white ml-2 w-10 h-10" />
                      </motion.div>
                  </motion.div>
              )}
          </AnimatePresence>
          <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-white border border-white/10 pointer-events-none">
              Motion Reel
          </div>
      </div>
    );
};

// --- REUSABLE METRICS COMPONENT ---
const ProjectMetrics: React.FC<{ project: Project }> = ({ project }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-12 border-b border-white/10 pb-20 mb-20"
    >
        <div className="space-y-4">
            <h4 className="text-brand-accent font-bold uppercase tracking-widest text-sm border-b border-white/10 pb-4">The Challenge</h4>
            <p className="text-lg text-white/60 leading-relaxed">{project.challenge || "Redefining the visual language in a saturated market."}</p>
        </div>
        <div className="space-y-4">
            <h4 className="text-brand-accent font-bold uppercase tracking-widest text-sm border-b border-white/10 pb-4">The Solution</h4>
            <p className="text-lg text-white/60 leading-relaxed">{project.solution || "We utilized generative design patterns coupled with strict typographic rules."}</p>
        </div>
        <div className="space-y-4">
            <h4 className="text-brand-accent font-bold uppercase tracking-widest text-sm border-b border-white/10 pb-4">The Outcome</h4>
            <p className="text-lg text-white/60 leading-relaxed">{project.outcome || "A significant increase in user engagement and brand perception."}</p>
        </div>
    </motion.div>
);

// --- LAYOUT COMPONENTS ---
const CaseStudyLayout: React.FC<{ project: Project }> = ({ project }) => {
  const gallery = project.gallery || [];
  const verticalImage = project.image;
  const wideImage = gallery.length > 0 ? gallery[0] : project.image;
  const extraImages = gallery.length > 1 ? gallery.slice(1) : [];

  return (
    <div className="max-w-5xl mx-auto">
        <motion.p layoutId={`card-desc-${project.id}`} className="text-2xl md:text-4xl leading-relaxed text-white/90 mb-20 font-light">
            {project.description}
        </motion.p>
        
        <ProjectMetrics project={project} />

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="space-y-8 md:space-y-12">
            {project.video && <ModalVideoPlayer src={project.video} />}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/5 bg-white/5 relative group">
                    <SmartImage src={verticalImage} alt="Detail view 1" className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/5 bg-white/5 flex flex-col justify-center p-8 md:p-12 relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                        <h4 className="text-2xl md:text-3xl font-display font-bold text-white mb-6 relative z-10">System <span className="text-brand-accent">Architecture</span></h4>
                        <p className="text-xl text-white/60 leading-relaxed relative z-10">The interface is built on a modular grid that adapts to user behavior.</p>
                </div>
            </div>
            <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden border border-white/5 relative group shadow-2xl">
                    <SmartImage src={wideImage} alt="Immersive View" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
        </motion.div>

        {extraImages.length > 0 && (
            <div className="mt-24 pt-24 border-t border-white/10">
                <h3 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-12">Process Gallery</h3>
                <div className="columns-1 md:columns-2 gap-8 space-y-8">
                    {extraImages.map((img, idx) => (
                        <div key={idx} className="break-inside-avoid rounded-2xl overflow-hidden border border-white/5 bg-black/20 shadow-lg group">
                             <SmartImage src={img} alt={`Gallery View ${idx + 3}`} className="w-full h-auto hover:scale-105 transition-transform duration-700" />
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};

const GalleryLayout: React.FC<{ project: Project }> = ({ project }) => {
    const images = (project.gallery && project.gallery.length > 0) ? project.gallery : [project.image, project.image];
    return (
        <div className="max-w-7xl mx-auto">
            <motion.div className="flex flex-col items-center text-center mb-16 max-w-3xl mx-auto">
                <motion.p layoutId={`card-desc-${project.id}`} className="text-xl md:text-2xl leading-relaxed text-white/70 font-light mb-12">{project.description}</motion.p>
            </motion.div>
            
            <ProjectMetrics project={project} />

            <div className="flex flex-col gap-12">
                {project.video && <ModalVideoPlayer src={project.video} />}
                {images.map((img, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="flex flex-col rounded-2xl overflow-hidden border border-white/5 relative shadow-2xl group bg-black/20">
                         <SmartImage src={img} alt={`Gallery item ${idx}`} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const MinimalLayout: React.FC<{ project: Project }> = ({ project }) => (
    <div className="max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
         <motion.p layoutId={`card-desc-${project.id}`} className="text-3xl md:text-5xl leading-tight text-white text-center font-display font-bold mb-12">"{project.description}"</motion.p>
        
        <div className="w-full mb-20">
             <ProjectMetrics project={project} />
        </div>

        <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group">
             {project.video ? (
                <SmartVideo src={project.video} autoPlay muted loop playsInline className="w-full h-full object-cover" />
             ) : (
                <SmartImage src={project.image} alt="Main Visual" className="w-full h-full object-cover" />
             )}
        </div>
    </div>
);

interface ProjectStackProps {
  onModalStateChange?: (isOpen: boolean) => void;
}

const ProjectStack: React.FC<ProjectStackProps> = ({ onModalStateChange }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });
  
  const { projects, generalContent } = useContent();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const isMobile = useIsMobile();
  
  const selectedProject = selectedProjectId ? projects.find(p => p.id === selectedProjectId) || null : null;
  const isSelectedHex = selectedProject ? (selectedProject.color.startsWith('#') || selectedProject.color.startsWith('rgb')) : false;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Determine which card is "active" based on scroll progress
    const index = Math.min(Math.floor(latest * projects.length), projects.length - 1);
    setActiveProjectIndex(Math.max(0, index));
  });

  useEffect(() => {
    if (onModalStateChange) {
        onModalStateChange(!!selectedProjectId);
    }
  }, [selectedProjectId, onModalStateChange]);

  const renderLayout = (project: Project) => {
      switch (project.layoutTemplate) {
          case 'gallery': return <GalleryLayout project={project} />;
          case 'minimal': return <MinimalLayout project={project} />;
          case 'case-study': default: return <CaseStudyLayout project={project} />;
      }
  };

  return (
    <section id="work" className="bg-brand-dark relative z-10">
      
      {/* --- DESKTOP VIEW (Framer Motion Sticky Stack) --- */}
      {!isMobile && (
        <div ref={container} className="relative px-6 md:px-16 lg:px-24">
            
            {/* Visual Progress Indicator (Desktop Only) */}
            <div className="absolute top-0 right-8 h-full z-20 pointer-events-none hidden xl:block">
                <div className="sticky top-0 h-screen flex flex-col justify-center">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-brand-dark/80 backdrop-blur-md p-2.5 rounded-full border border-white/10 flex flex-col items-center gap-2 shadow-2xl"
                    >
                        <motion.span 
                            key={activeProjectIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-brand-accent font-display font-bold text-sm"
                        >
                            {(activeProjectIndex + 1).toString().padStart(2, '0')}
                        </motion.span>
                        
                        <div className="w-px h-10 bg-white/10 relative rounded-full overflow-hidden">
                            <motion.div 
                                className="absolute top-0 left-0 w-full bg-brand-accent"
                                style={{ 
                                    height: `${((activeProjectIndex + 1) / projects.length) * 100}%`
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        </div>

                        <span className="text-white/30 font-display font-bold text-[10px]">
                            {projects.length.toString().padStart(2, '0')}
                        </span>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20%" }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-5xl md:text-8xl font-display font-bold text-white text-center">
                        {generalContent.projects.title}
                    </h2>
                    <p className="text-center text-white/40 mt-6 max-w-2xl mx-auto text-xl">
                        {generalContent.projects.subtitle}
                    </p>
                </motion.div>
            </div>
            {projects.map((project, index) => {
                const targetScale = 1 - ( (projects.length - index) * 0.05 );
                const rangeStart = index * (1 / projects.length);
                return (
                    <DesktopCard 
                        key={project.id} 
                        project={project} 
                        index={index}
                        progress={scrollYProgress}
                        range={[rangeStart, 1]}
                        targetScale={targetScale}
                        onSelect={(p) => setSelectedProjectId(p.id)}
                    />
                );
            })}
        </div>
      )}

      {/* --- MOBILE/TABLET VIEW (Native CSS Sticky Stack) --- */}
      {isMobile && (
        <div className="relative w-full">
            {/* Header Block (Normal Flow) */}
            <div className="pt-24 pb-12 px-6 md:px-16">
                 <div className="mb-12 border-b border-white/10 pb-8 flex flex-col gap-6">
                    <div>
                        <h2 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-4">The Work</h2>
                        <h3 className="text-4xl md:text-6xl font-display font-bold text-white">
                            {generalContent.projects.title}
                        </h3>
                    </div>
                    <p className="text-lg text-white/50 max-w-md mt-0">
                        {generalContent.projects.subtitle}
                    </p>
                 </div>
            </div>

            {/* Stacked Cards */}
            <div className="relative w-full">
                {projects.map((project, index) => (
                    <MobileCard 
                        key={project.id}
                        project={project}
                        index={index}
                        total={projects.length}
                        onSelect={(p) => setSelectedProjectId(p.id)}
                    />
                ))}
                {/* Bottom Spacer to ensure last card can be fully viewed */}
                <div className="h-[20vh] w-full bg-transparent" />
            </div>
        </div>
      )}

      {/* Full Screen Modal */}
      <AnimatePresence>
        {selectedProject && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setSelectedProjectId(null)}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />
                <motion.div
                    layoutId={`card-container-${selectedProject.id}`}
                    className={`
                        relative w-[96vw] h-[96svh] rounded-[2rem] md:w-[94vw] md:h-[94vh] md:rounded-[2rem] 
                        overflow-hidden bg-brand-dark flex flex-col border border-white/10 shadow-2xl
                        ${!isSelectedHex ? selectedProject.color : ''}
                    `}
                    style={{ backgroundColor: isSelectedHex ? selectedProject.color : undefined }}
                >
                     <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedProjectId(null); }}
                        className="absolute top-6 right-6 md:top-6 md:right-6 z-[60] w-12 h-12 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-brand-accent hover:text-black transition-all border border-white/10"
                    >
                        <X size={24} />
                    </button>

                    <div className="w-full h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
                        {/* Modal Image Header - REMOVED layoutId from image */}
                        <div className="w-full h-[40vh] md:h-[60vh] relative overflow-hidden">
                            <SmartImage src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
                            {selectedProject.video && (
                                <SmartVideo src={selectedProject.video} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full z-10">
                                 <div className="flex space-x-4 mb-4">
                                    <motion.span layoutId={`card-category-${selectedProject.id}`} className="px-4 py-1.5 rounded-full border border-white/20 text-sm uppercase tracking-widest bg-black/40 backdrop-blur-sm text-white">{selectedProject.category}</motion.span>
                                    <motion.span layoutId={`card-year-${selectedProject.id}`} className="px-4 py-1.5 rounded-full border border-white/20 text-sm uppercase tracking-widest bg-black/40 backdrop-blur-sm text-white">{selectedProject.year}</motion.span>
                                 </div>
                                <motion.h3 layoutId={`card-title-${selectedProject.id}`} className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-2 break-words leading-[0.9]">{selectedProject.title}</motion.h3>
                            </div>
                        </div>
                        <div className="bg-brand-dark px-6 py-12 md:p-16 flex-1">
                            {renderLayout(selectedProject)}
                            <div className="mt-24 pt-12 border-t border-white/10 text-center pb-12">
                                <p className="text-white/30 text-sm uppercase tracking-widest mb-4">Project Complete</p>
                                <h3 className="text-3xl font-display font-bold text-white">{selectedProject.title}</h3>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProjectStack;

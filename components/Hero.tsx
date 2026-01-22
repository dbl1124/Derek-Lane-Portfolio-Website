
import React, { useRef, useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SmartImage from './SmartImage';
import { useContent } from '../contexts/ContentContext';

interface Point {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
}

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 }); // Initialize off-screen
  const animationRef = useRef<number>(0);
  const { generalContent } = useContent();

  // Configuration
  const GRID_SPACING = 40;
  const MOUSE_RADIUS = 400; // Increased for larger interactive area
  const MOUSE_FORCE = 0.15; // Strength of repulsion
  const SPRING = 0.08;      // Snap back speed
  const FRICTION = 0.85;    // Damping to prevent endless oscillating

  // Track the spacer scroll progress because the hero itself is fixed
  const { scrollYProgress } = useScroll({
    target: spacerRef,
    offset: ["start start", "end start"]
  });

  // Scroll Animations
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const xRight = useTransform(scrollYProgress, [0, 0.4], [0, 100]); 
  const xLeft = useTransform(scrollYProgress, [0, 0.4], [0, -100]); 
  
  // Scale from 1 to 1.2 (increased by another 10% for parallax depth)
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  // Debugging Image Path
  useEffect(() => {
    const imagePath = generalContent.hero.image;
    // console.log("Hero is trying to load:", imagePath);
  }, [generalContent.hero.image]);

  // Initialize Grid
  const initGrid = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Use container dimensions to ensure we don't overflow the viewport width with scrollbars
    const width = container.clientWidth;
    const height = container.clientHeight;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    // Create points
    const cols = Math.ceil(width / GRID_SPACING);
    const rows = Math.ceil(height / GRID_SPACING);
    const newPoints: Point[] = [];

    // Center the grid slightly
    const xOffset = (width - (cols - 1) * GRID_SPACING) / 2;
    const yOffset = (height - (rows - 1) * GRID_SPACING) / 2;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = xOffset + c * GRID_SPACING;
            const y = yOffset + r * GRID_SPACING;
            newPoints.push({
                x,
                y,
                originX: x,
                originY: y,
                vx: 0,
                vy: 0
            });
        }
    }
    pointsRef.current = newPoints;
  };

  // Animation Loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width / (window.devicePixelRatio || 1);
    const height = canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, width, height);
    
    // Draw Styles
    ctx.lineWidth = 1;

    const mouseX = mouseRef.current.x;
    const mouseY = mouseRef.current.y;

    pointsRef.current.forEach(point => {
        // 1. Physics Calculations
        
        // Distance to mouse
        const dx = mouseX - point.x;
        const dy = mouseY - point.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Mouse Repulsion
        if (dist < MOUSE_RADIUS) {
            const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
            const angle = Math.atan2(dy, dx);
            const pushX = Math.cos(angle) * force * MOUSE_FORCE * -100; // Push away
            const pushY = Math.sin(angle) * force * MOUSE_FORCE * -100;
            
            point.vx += pushX;
            point.vy += pushY;
        }

        // Spring back to origin
        const returnX = point.originX - point.x;
        const returnY = point.originY - point.y;
        
        point.vx += returnX * SPRING;
        point.vy += returnY * SPRING;

        // Apply Friction
        point.vx *= FRICTION;
        point.vy *= FRICTION;

        // Update Position
        point.x += point.vx;
        point.y += point.vy;

        // 2. Draw Crosshair
        const speed = Math.abs(point.vx) + Math.abs(point.vy);
        
        let r = 255, g = 255, b = 255;
        let proximity = 0;

        if (dist < MOUSE_RADIUS) {
            proximity = 1 - (dist / MOUSE_RADIUS);
            r = 255 + (212 - 255) * proximity;
            g = 255 + (251 - 255) * proximity;
            b = 255 + (121 - 255) * proximity;
        }

        const baseOpacity = 0.15;
        const activeOpacity = Math.min(0.8, speed * 0.1 + baseOpacity + (proximity * 0.4));

        ctx.strokeStyle = `rgba(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)}, ${activeOpacity})`;
        
        const size = 3;
        ctx.beginPath();
        ctx.moveTo(point.x - size, point.y);
        ctx.lineTo(point.x + size, point.y);
        ctx.moveTo(point.x, point.y - size);
        ctx.lineTo(point.x, point.y + size);
        ctx.stroke();
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    initGrid();
    animationRef.current = requestAnimationFrame(animate);
    
    const handleResize = () => {
        initGrid();
    };

    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
        mouseRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -1000, y: -1000 };
  };

  // Robust check for invalid paths from Admin Panel (e.g. empty strings)
  const heroImage = (generalContent.hero.image && generalContent.hero.image.length > 4) 
    ? generalContent.hero.image 
    : "/images/hero-portrait.jpg";

  return (
    <>
      {/* Spacer Element to maintain document flow height while Hero is fixed */}
      <div ref={spacerRef} id="hero" className="h-[100svh] md:h-screen w-full relative z-0 pointer-events-none" />

      <section 
        // No ID here, it is on spacer for correct anchor scrolling
        ref={containerRef}
        className="fixed inset-0 h-[100svh] md:h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-brand-dark z-0"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* LAYER 1: CLEAN IMAGE (COLOR) */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <motion.div style={{ scale }} className="w-full h-full">
              <SmartImage 
                  src={heroImage}
                  // SAFETY NET fallback
                  fallbackSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1920&q=80"
                  alt="Hero Background"
                  className="w-full h-full object-cover opacity-55"
              />
          </motion.div>
          {/* Subtle radial fade */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </div>

        {/* LAYER 2: PHYSICS CANVAS */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-10 w-full h-full pointer-events-none"
        />

        {/* Vignette */}
        <div className="absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,10,10,0.5)_70%,rgba(10,10,10,1)_100%)] pointer-events-none" />

        {/* Content */}
        <div className="z-30 text-center px-6 md:px-12 lg:px-16 max-w-5xl relative pointer-events-none mix-blend-screen">
          
          {/* Eyebrow */}
          <motion.div 
              style={{ opacity: scrollOpacity }}
              className="mb-8"
          >
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-brand-accent text-sm md:text-base uppercase tracking-[0.3em] font-medium drop-shadow-lg"
              >
                {generalContent.hero.eyebrow}
              </motion.p>
          </motion.div>
          
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.9] text-white mb-6 md:mb-10 tracking-tighter drop-shadow-2xl flex flex-col items-center">
            <motion.div 
              style={{ x: xRight, opacity: scrollOpacity }}
              className="w-full"
            >
              <motion.span
                  initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
              >
                  {generalContent.hero.titleLine1}
              </motion.span>
            </motion.div>

            <motion.div 
              style={{ x: xLeft, opacity: scrollOpacity }}
              className="w-full"
            >
              <motion.span
                  initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40"
              >
                  {generalContent.hero.titleLine2}
              </motion.span>
            </motion.div>
          </h1>

          {/* Description */}
          <motion.div
            style={{ opacity: scrollOpacity }}
          >
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-white/70 max-w-xl mx-auto text-xl md:text-2xl leading-relaxed drop-shadow-md font-medium"
              >
                {generalContent.hero.description}
              </motion.p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          style={{ opacity: scrollOpacity }}
          className="absolute bottom-12 animate-bounce z-30"
        >
          <ArrowDown className="text-white/50 w-6 h-6" />
        </motion.div>
      </section>
    </>
  );
};

export default Hero;

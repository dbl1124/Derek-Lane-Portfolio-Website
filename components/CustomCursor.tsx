
import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  // Physics configuration for the trailing ring
  // Damping: 25 (friction), Stiffness: 150 (speed/snap)
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPointerFine, setIsPointerFine] = useState(false);

  useEffect(() => {
    // Check if the device uses a fine pointer (mouse)
    // This prevents the custom cursor from showing up on touch devices where it acts 'sticky'
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsPointerFine(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsPointerFine(e.matches);

    // Modern browsers
    try {
        mediaQuery.addEventListener('change', handleChange);
    } catch {
        // Fallback for older Safari/Browsers
        try {
            mediaQuery.addListener(handleChange);
        } catch (e) {
            console.warn("Media query listener not supported");
        }
    }

    return () => {
        try {
            mediaQuery.removeEventListener('change', handleChange);
        } catch {
            try {
                mediaQuery.removeListener(handleChange);
            } catch (e) {
                // Ignore removal error
            }
        }
    };
  }, []);

  useEffect(() => {
    // Do not attach any listeners if we are on a touch device
    if (!isPointerFine) return;

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Helper to check if element is interactive
      const isInteractive = 
          target.tagName.toLowerCase() === 'a' || 
          target.tagName.toLowerCase() === 'button' ||
          target.tagName.toLowerCase() === 'input' ||
          target.tagName.toLowerCase() === 'textarea' ||
          target.closest('a') !== null || 
          target.closest('button') !== null ||
          window.getComputedStyle(target).cursor === 'pointer';

      setIsHovering(isInteractive);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible, isPointerFine]);

  if (!isPointerFine) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] mix-blend-difference block overflow-hidden">
        {/* Main Dot - Instant follower for precision */}
        <motion.div
            className="absolute w-2 h-2 bg-brand-accent rounded-full"
            style={{ 
                x: mouseX, 
                y: mouseY,
                translateX: '-50%',
                translateY: '-50%'
            }}
            animate={{
                scale: isHovering ? 0 : 1,
                opacity: isHovering ? 0 : 1
            }}
        />
        
        {/* Outer Ring - Smooth, springy follower */}
        <motion.div
            className="absolute w-8 h-8 border border-brand-accent rounded-full flex items-center justify-center"
            style={{ 
                x: ringX, 
                y: ringY,
                translateX: '-50%',
                translateY: '-50%'
            }}
            animate={{
                width: isHovering ? 64 : 32,
                height: isHovering ? 64 : 32,
                scale: isClicking ? 0.8 : 1,
                backgroundColor: isHovering ? '#d4fb79' : 'transparent',
                mixBlendMode: isHovering ? 'difference' : 'normal',
            }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 25
            }}
        >
            {/* You can add a small 'VIEW' text here for specific hover states if you want later */}
        </motion.div>
    </div>
  );
};

export default CustomCursor;

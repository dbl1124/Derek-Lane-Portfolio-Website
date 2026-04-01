

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../contexts/ContentContext';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [index, setIndex] = useState(0);
  const { generalContent } = useContent();
  
  // Use words from context, fallback to default if missing (safety check)
  const words = (generalContent.preloader && generalContent.preloader.words && generalContent.preloader.words.length > 0) 
    ? generalContent.preloader.words 
    : ["STRATEGY", "DESIGN", "EXPERIENCE", "INNOVATION", "IMMERSION"];
  
  useEffect(() => {
    const duration = 2500; 
    const intervalTime = duration / 100;
    
    const interval = setInterval(() => {
      setCount(prev => {
        const newCount = prev + 1;
        if (newCount >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newCount;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Change word periodically based on progress
    // We want to cycle through all words by the time we hit 100%
    // Progress per word = 100 / length
    const progressPerWord = 100 / words.length;
    const calculatedIndex = Math.min(Math.floor(count / progressPerWord), words.length - 1);
    
    setIndex(calculatedIndex);
    
    if (count === 100) {
      const timeout = setTimeout(onComplete, 600);
      return () => clearTimeout(timeout);
    }
  }, [count, onComplete, words.length]);

  return (
    <motion.div 
      className="fixed inset-0 z-[9999] bg-brand-dark flex flex-col justify-between p-8 md:p-12 cursor-wait overflow-hidden"
      initial={{ y: 0 }}
      exit={{ y: '-100%', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
    >
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-brand-accent/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 flex justify-between items-start text-white/30 font-mono text-xs uppercase tracking-widest">
         <span className="hidden md:block">Portfolio ©2024</span>
         <span className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></span>
            <span>System Loading</span>
         </span>
      </div>

      {/* Center Text */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center">
        <motion.h2 
            key={words[index]}
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.3 }}
            className="text-4xl md:text-8xl font-display font-bold text-white tracking-tighter"
        >
            {words[index]}
        </motion.h2>
      </div>

      {/* Bottom Area */}
      <div className="relative z-10 flex justify-between items-end">
          <div className="hidden md:block text-white/20 text-sm font-mono max-w-xs">
            INITIALIZING CORE MODULES...<br/>
            OPTIMIZING ASSETS...<br/>
            CALIBRATING WEBGL...
          </div>
          <h1 className="text-[6rem] md:text-[14rem] leading-[0.8] font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 tracking-tighter">
            {count}%
          </h1>
      </div>
      
      {/* Progress Bar Line */}
      <div className="absolute bottom-0 left-0 h-1 md:h-2 bg-gradient-to-r from-brand-accent to-brand-secondary transition-all ease-linear" style={{ width: `${count}%` }} />
    </motion.div>
  );
};

export default Preloader;
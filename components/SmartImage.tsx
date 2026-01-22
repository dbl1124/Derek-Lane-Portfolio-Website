
import React, { useState, useEffect } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface SmartImageProps extends HTMLMotionProps<"img"> {
  layoutId?: string;
  fallbackSrc?: string; // Specific fallback for this instance
}

// ===========================================================================
// DEMO MODE CONFIGURATION
// Set this to FALSE when you are ready to use your own images from /public/images
// ===========================================================================
const USE_DEMO_IMAGES = false; 

// Pool of high-quality fallback images to simulate variety for new uploads
const FALLBACK_POOL = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=1200&q=80'
];

// Simple hash function to deterministically pick an image from the pool based on the filename string
const getFallbackImage = (str: string) => {
    let hash = 0;
    if (str) {
      for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
    }
    const index = Math.abs(hash) % FALLBACK_POOL.length;
    return FALLBACK_POOL[index];
};

const SmartImage: React.FC<SmartImageProps> = ({ src, alt, className, layoutId, fallbackSrc, ...props }) => {
  const [imgSrc, setImgSrc] = useState<string>((src as string) || '');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset state when src prop changes
    setImgSrc((src as string) || '');
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (hasError) return;

    // 1. Second Option: Specific Fallback (Provided via props)
    if (fallbackSrc && imgSrc !== fallbackSrc) {
        setImgSrc(fallbackSrc);
        setHasError(true); 
        return;
    }

    // 2. Third Option: Demo Mode Fallback
    if (USE_DEMO_IMAGES) {
        const demoFallback = getFallbackImage((src as string) || 'default');
        if (imgSrc !== demoFallback) {
            setImgSrc(demoFallback);
            setHasError(true);
        }
        return;
    }

    // 3. Final Failure
    setHasError(true);
  };

  // Always return motion.img. 
  // This allows `animate` and `transition` props to work even if layoutId is not present.
  return (
    <motion.img
      layoutId={layoutId}
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default SmartImage;
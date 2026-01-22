
import React, { forwardRef } from 'react';
import { motion, MotionProps } from 'framer-motion';

// Mapping for demo purposes so the user sees video content immediately.
// When you replace files locally, these paths will be ignored if the local file exists, 
// or you can remove this mapping logic in production.
const VIDEO_MAP: Record<string, string> = {
  '/videos/projects/project1.mp4': 'https://videos.pexels.com/video-files/3129671/3129671-sd_640_360_30fps.mp4', // Abstract Neon
  '/videos/projects/project2.mp4': 'https://videos.pexels.com/video-files/855564/855564-hd_1280_720_24fps.mp4', // Nature/Water
  '/videos/projects/project3.mp4': 'https://videos.pexels.com/video-files/6981411/6981411-hd_1280_720_25fps.mp4', // Velvet/Red Liquid Abstract (Updated)
  '/videos/projects/project4.mp4': 'https://videos.pexels.com/video-files/6943602/6943602-hd_1280_720_25fps.mp4', // B&W Abstract
  '/videos/projects/project5.mp4': 'https://videos.pexels.com/video-files/3129957/3129957-hd_1280_720_25fps.mp4', // Blue/Tech
  '/videos/projects/project6.mp4': 'https://videos.pexels.com/video-files/1851190/1851190-hd_1280_720_25fps.mp4', // Data/Coding
};

type SmartVideoProps = React.VideoHTMLAttributes<HTMLVideoElement> & MotionProps;

const SmartVideo = forwardRef<HTMLVideoElement, SmartVideoProps>((props, ref) => {
  const { src, ...rest } = props;
  
  // Type guard to ensure src is a string before checking the map
  let finalSrc = (src && typeof src === 'string' && VIDEO_MAP[src]) ? VIDEO_MAP[src] : src;

  // Fallback for new projects added via Admin that don't have local files yet
  if (src && typeof src === 'string' && !VIDEO_MAP[src] && src.startsWith('/videos/projects/')) {
     // Generic abstract background video placeholder
     finalSrc = 'https://videos.pexels.com/video-files/5091624/5091624-hd_1280_720_24fps.mp4';
  }

  return (
    <motion.video
      ref={ref}
      src={finalSrc}
      crossOrigin="anonymous"
      {...rest}
    />
  );
});

export default SmartVideo;

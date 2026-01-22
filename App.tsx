import React, { useState, useEffect, useLayoutEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import ProjectStack from './components/ProjectStack';
import Process from './components/Process';
import Experience from './components/Experience';
import Capabilities from './components/Capabilities';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import AIChatbot from './components/AIChatbot';
import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';
import { AnimatePresence } from 'framer-motion';
import { ContentProvider } from './contexts/ContentContext';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Fix for Mobile Safari: Force scroll to top on load to ensure Hero animations start correctly
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. Force top immediately to reset scroll position
      window.scrollTo(0, 0);
      
      // 2. Disable browser's default scroll restoration which often restores 
      // the page to the middle on mobile refreshes, breaking parallax start points
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
    }
  }, []);

  // Double check: Ensure we are at 0,0 when preloader finishes and content reveals
  useEffect(() => {
    if (!isLoading) {
      window.scrollTo(0, 0);
    }
  }, [isLoading]);

  return (
    <ContentProvider>
      <div className="bg-brand-dark min-h-screen w-full selection:bg-brand-accent selection:text-black">
        <CustomCursor />
        
        <AnimatePresence>
          {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
        </AnimatePresence>

        {!isLoading && (
          <>
            <Navbar isHidden={isProjectModalOpen} />
            <main className="w-full">
              <Hero />
              <Manifesto />
              <ProjectStack onModalStateChange={setIsProjectModalOpen} />
              <Process />
              <Experience />
              <Capabilities />
              <Testimonials />
              <Contact />
            </main>
            <AIChatbot />
          </>
        )}
      </div>
    </ContentProvider>
  );
};

export default App;
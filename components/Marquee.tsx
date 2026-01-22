
import React from 'react';

const Marquee: React.FC = () => {
  const text = "CREATIVE DIRECTION — BRAND STRATEGY — DIGITAL EXPERIENCE — SPATIAL DESIGN — ";
  
  return (
    <div className="py-8 bg-brand-accent overflow-hidden border-y border-black/10 relative z-20">
        <div className="relative flex overflow-x-hidden">
            <div className="animate-marquee whitespace-nowrap">
                <span className="text-4xl md:text-6xl font-display font-bold text-brand-dark mx-4">
                    {text} {text} {text}
                </span>
            </div>
            <div className="absolute top-0 animate-marquee2 whitespace-nowrap">
                <span className="text-4xl md:text-6xl font-display font-bold text-brand-dark mx-4">
                    {text} {text} {text}
                </span>
            </div>
        </div>
    </div>
  );
};

export default Marquee;

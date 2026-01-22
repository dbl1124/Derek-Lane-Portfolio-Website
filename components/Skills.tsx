import React from 'react';
import { SKILLS } from '../constants';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { motion } from 'framer-motion';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-gray border border-white/10 p-4 rounded-lg shadow-xl">
        <p className="text-brand-accent font-display font-bold mb-1">{label}</p>
        <p className="text-white text-sm">Proficiency: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-32 bg-neutral-900">
      <div className="max-w-7xl mx-auto px-6 md:px-16 flex flex-col md:flex-row gap-20 items-center">
        
        <div className="w-full md:w-1/2">
          <h2 className="text-sm font-bold text-brand-accent uppercase tracking-widest mb-4">Capabilities</h2>
          <h3 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">
            The intersection of <br/> Art & Technology
          </h3>
          <p className="text-white/60 text-lg leading-relaxed mb-12">
            Modern creative direction requires a hybrid mindset. I speak the languages of design, business, and code fluently, allowing me to lead diverse teams and bridge gaps between stakeholders.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 glass-panel rounded-xl">
                <h4 className="text-white font-bold mb-2">Strategic</h4>
                <p className="text-sm text-white/50">Brand Positioning, Market Analysis, Campaign Strategy</p>
            </div>
            <div className="p-6 glass-panel rounded-xl">
                <h4 className="text-white font-bold mb-2">Technical</h4>
                <p className="text-sm text-white/50">React, Three.js, WebGL, Motion Design</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SKILLS} layout="vertical" margin={{ left: 40 }}>
              <XAxis type="number" hide domain={[0, 100]} />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#ffffff" 
                fontSize={12} 
                tick={{ fill: '#9ca3af' }}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
              <Bar dataKey="level" radius={[0, 4, 4, 0]} barSize={20}>
                {SKILLS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#d4fb79' : '#ffffff'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-center text-xs text-white/30 mt-4">Interactive Proficiency Matrix</p>
        </div>

      </div>
    </section>
  );
};

export default Skills;
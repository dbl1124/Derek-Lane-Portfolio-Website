

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Lock, Save, RefreshCw, Home, Layout, GitBranch, Briefcase, Zap, MessageSquare, Download, Plus, Trash2, GripVertical, ExternalLink, Image as ImageIcon, PlayCircle, Layers, Upload } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'general' | 'projects' | 'process' | 'experience' | 'services' | 'testimonials' | 'help';

// ==========================================
// CONFIGURATION
// ==========================================
// TO CHANGE ADMIN PASSWORD: Edit the string value below.
const ADMIN_PASSWORD = 'admin'; 

// Legacy theme mapping for the color picker to provide a decent default
const PROJECT_THEMES = [
  { name: 'Onyx', class: 'bg-zinc-900', hex: '#18181b' },
  { name: 'Slate', class: 'bg-slate-900', hex: '#0f172a' },
  { name: 'Deep Blue', class: 'bg-blue-950', hex: '#172554' },
  { name: 'Emerald', class: 'bg-emerald-950', hex: '#022c22' },
  { name: 'Rose', class: 'bg-rose-950', hex: '#4c0519' },
  { name: 'Indigo', class: 'bg-indigo-950', hex: '#1e1b4b' },
  { name: 'Purple', class: 'bg-purple-950', hex: '#3b0764' },
  { name: 'Brown', class: 'bg-amber-950', hex: '#451a03' },
];

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  
  // Sub-selection states
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [selectedEduId, setSelectedEduId] = useState<number | null>(null);
  const [selectedCapabilityIndex, setSelectedCapabilityIndex] = useState<number | null>(0);
  const [selectedTestimonialId, setSelectedTestimonialId] = useState<number | null>(null);

  // Local input states to allow for comfortable typing (e.g. trailing commas)
  const [preloaderInput, setPreloaderInput] = useState('');
  const [galleryInput, setGalleryInput] = useState('');

  // Refs for file inputs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const testimonialAvatarRef = useRef<HTMLInputElement>(null);
  const heroImageInputRef = useRef<HTMLInputElement>(null);

  const { 
    projects, updateProject, addProject, deleteProject, reorderProjects,
    generalContent, updateGeneralContent,
    processSteps, updateProcessStep,
    experience, updateExperience,
    education, updateEducation,
    capabilities, updateCapabilityCategory,
    testimonials, updateTestimonial,
    resetData 
  } = useContent();

  // Sync Preloader Input ONLY when entering General tab.
  // We exclude generalContent from dependencies to prevent overwriting user input while typing.
  useEffect(() => {
    if (activeTab === 'general' && generalContent.preloader?.words) {
      setPreloaderInput(generalContent.preloader.words.join(', '));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Sync Gallery Input ONLY when a NEW project is selected.
  // We exclude 'projects' from dependencies to prevent overwriting user input while typing.
  useEffect(() => {
    const project = projects.find(p => p.id === selectedProjectId);
    if (project) {
        setGalleryInput(project.gallery?.join(', ') || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectId]);


  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleAddProject = () => {
    const newId = addProject();
    setSelectedProjectId(newId);
  };

  const handleExport = () => {
    const timestamp = new Date().toISOString();
    const fileContent = `
import { Project, Testimonial, Skill, ProcessStep, ExperienceItem, EducationItem, GeneralContent, CapabilityCategory } from './types';

// Updated: ${timestamp}
export const CONTENT_VERSION = "${timestamp}";

export const GENERAL_CONTENT: GeneralContent = ${JSON.stringify(generalContent, null, 2)};

export const MANIFESTO = GENERAL_CONTENT.manifesto.content;

export const PROJECTS: Project[] = ${JSON.stringify(projects, null, 2)};

export const PROCESS_STEPS: ProcessStep[] = ${JSON.stringify(processSteps, null, 2)};

export const EXPERIENCE: ExperienceItem[] = ${JSON.stringify(experience, null, 2)};

export const EDUCATION: EducationItem[] = ${JSON.stringify(education, null, 2)};

export const CAPABILITIES: CapabilityCategory[] = ${JSON.stringify(capabilities, null, 2)};

export const TESTIMONIALS: Testimonial[] = ${JSON.stringify(testimonials, null, 2)};

// Legacy Skills Data
export const SKILLS: Skill[] = [
  { name: "Creative Direction", level: 95, category: "Strategy" },
  { name: "Brand Strategy", level: 90, category: "Strategy" },
  { name: "UI/UX Design", level: 88, category: "Design" },
  { name: "Motion Graphics", level: 85, category: "Design" },
  { name: "3D Prototyping", level: 75, category: "Design" },
  { name: "Frontend Dev", level: 70, category: "Tech" },
];
`;

    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'constants_export.ts';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helpers for fetching selected items
  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const selectedJob = experience.find(e => e.id === selectedJobId);
  const selectedEdu = education.find(e => e.id === selectedEduId);
  const selectedCapability = selectedCapabilityIndex !== null ? capabilities[selectedCapabilityIndex] : null;
  const selectedTestimonial = testimonials.find(t => t.id === selectedTestimonialId);

  const SidebarItem = ({ id, label, icon: Icon }: { id: Tab, label: string, icon: any }) => (
    <button 
        onClick={() => setActiveTab(id)}
        className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors ${activeTab === id ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
    >
        <Icon size={18} />
        <span>{label}</span>
    </button>
  );

  // Helper to get a valid hex for the color picker input, handling legacy Tailwind classes
  const getProjectColorHex = (colorStr: string) => {
    if (!colorStr) return '#000000';
    if (colorStr.startsWith('#')) return colorStr;
    
    // Try to match existing themes
    const existingTheme = PROJECT_THEMES.find(t => t.class === colorStr);
    if (existingTheme) return existingTheme.hex;

    return '#000000'; 
  };

  // Helper to handle gallery input (comma separated string <-> array)
  // Now only updates the context; local state is handled by the onChange handler directly
  const updateGalleryContext = (str: string, project: any) => {
      const arr = str.split(',').map(s => s.trim()).filter(s => s.length > 0);
      updateProject({ ...project, gallery: arr });
  };

  // --- FILE HANDLING ---
  // Since we can't upload to disk in browser, we generate the Path String for the user
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'gallery' | 'avatar' | 'hero') => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const files: File[] = Array.from(fileList);
      
      // Determine base folder path based on type
      let basePath = '/images/';
      if (type === 'video') basePath = '/videos/projects/';
      else if (type === 'image') basePath = '/images/projects/';
      else if (type === 'gallery') basePath = '/images/projects/';
      else if (type === 'avatar') basePath = '/images/testimonials/';
      else if (type === 'hero') basePath = '/images/';

      if (type === 'gallery' && selectedProject) {
        // Append new files to gallery
        const newPaths = files.map(f => `${basePath}${f.name}`);
        const currentGallery = selectedProject.gallery || [];
        const updatedGallery = [...currentGallery, ...newPaths];
        
        // Update both context and local input string
        updateProject({
            ...selectedProject,
            gallery: updatedGallery
        });
        setGalleryInput(updatedGallery.join(', '));
        
      } else if (type === 'avatar' && selectedTestimonial) {
         updateTestimonial({
             ...selectedTestimonial,
             avatar: `${basePath}${files[0].name}`
         });
      } else if (type === 'hero') {
          updateGeneralContent({
              ...generalContent,
              hero: { ...generalContent.hero, image: `${basePath}${files[0].name}` }
          });
      } else if (selectedProject) {
         if (type === 'image') {
            updateProject({
                ...selectedProject,
                image: `${basePath}${files[0].name}`
            });
         } else if (type === 'video') {
            updateProject({
                ...selectedProject,
                video: `${basePath}${files[0].name}`
            });
         }
      }

      // Reset input value to allow selecting the same file again if needed
      e.target.value = '';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-6xl h-[85vh] bg-brand-gray border border-white/10 rounded-2xl shadow-2xl flex overflow-hidden"
          >
            {!isAuthenticated ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-8">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <Lock className="text-brand-accent" size={32} />
                </div>
                <h2 className="text-2xl font-display font-bold text-white mb-2">Admin Access</h2>
                <p className="text-white/50 mb-8">Enter your credentials to manage content.</p>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-accent w-64 mb-4 text-center"
                />
                <button 
                  onClick={handleLogin}
                  className="bg-brand-accent text-black font-bold px-8 py-3 rounded-lg hover:bg-white transition-colors"
                >
                  Unlock Dashboard
                </button>
                <button onClick={onClose} className="mt-8 text-white/30 hover:text-white text-sm">
                  Cancel
                </button>
              </div>
            ) : (
              <>
                {/* Sidebar */}
                <div className="w-64 bg-black/40 border-r border-white/10 flex flex-col shrink-0">
                  <div className="p-6 border-b border-white/10">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-brand-accent rounded-full animate-pulse" />
                        <span className="font-bold text-white tracking-widest text-sm">CMS LIVE</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <p className="text-xs text-white/30 uppercase tracking-widest px-4 py-2 mt-2">General</p>
                    <SidebarItem id="general" label="Home & Intro" icon={Home} />
                    
                    <p className="text-xs text-white/30 uppercase tracking-widest px-4 py-2 mt-4">Work</p>
                    <SidebarItem id="projects" label="Projects" icon={Layout} />
                    <SidebarItem id="process" label="Process" icon={GitBranch} />
                    
                    <p className="text-xs text-white/30 uppercase tracking-widest px-4 py-2 mt-4">About</p>
                    <SidebarItem id="experience" label="Experience" icon={Briefcase} />
                    <SidebarItem id="services" label="Capabilities" icon={Zap} />
                    <SidebarItem id="testimonials" label="Testimonials" icon={MessageSquare} />
                    
                    <p className="text-xs text-white/30 uppercase tracking-widest px-4 py-2 mt-4">System</p>
                    <SidebarItem id="help" label="Export / Help" icon={Download} />
                  </div>

                  <div className="p-4 border-t border-white/10">
                    <button onClick={onClose} className="w-full py-2 text-white/50 hover:text-white text-sm border border-white/10 rounded-lg">
                        Exit Admin
                    </button>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                    {/* Header */}
                    <div className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-brand-gray/50 shrink-0">
                        <h2 className="text-xl font-bold text-white capitalize">
                            {activeTab} Editor
                        </h2>
                        <div className="flex space-x-4">
                             <button 
                                onClick={resetData}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm transition-colors"
                            >
                                <RefreshCw size={14} />
                                <span>Reset</span>
                            </button>
                            <button 
                                onClick={handleExport}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-brand-accent text-black hover:bg-white font-bold text-sm transition-colors"
                            >
                                <Save size={14} />
                                <span>Save Config</span>
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-hidden flex bg-black/20">
                        
                        {/* --- GENERAL TAB --- */}
                        {activeTab === 'general' && (
                            <div className="w-full p-8 overflow-y-auto space-y-8">
                                <input 
                                  type="file" 
                                  ref={heroImageInputRef} 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={(e) => handleFileSelect(e, 'hero')}
                                />
                                <div className="max-w-3xl mx-auto">
                                    <h3 className="text-brand-accent font-bold uppercase tracking-widest text-sm mb-6 pb-2 border-b border-white/10">Hero Section</h3>
                                    
                                    <div className="space-y-4 mb-12">
                                        {/* Hero Image Input */}
                                        <div className="space-y-2 mb-6">
                                            <label className="text-xs text-white/50 uppercase tracking-widest flex items-center gap-2">
                                                <ImageIcon size={12} /> Background Image Path
                                            </label>
                                            <div className="flex gap-4 items-start">
                                                <div className="flex-1 flex gap-2">
                                                    <input 
                                                        type="text" 
                                                        value={generalContent.hero.image || '/images/hero-portrait.jpg'} 
                                                        onChange={(e) => updateGeneralContent({...generalContent, hero: {...generalContent.hero, image: e.target.value}})}
                                                        className="flex-1 bg-black/20 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none font-mono" 
                                                    />
                                                    <button onClick={() => heroImageInputRef.current?.click()} className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded border border-white/10 text-white" title="Browse File">
                                                        <Upload size={16} />
                                                    </button>
                                                </div>
                                                <div className="w-20 h-12 bg-black rounded border border-white/10 overflow-hidden flex-shrink-0 relative group">
                                                    <img 
                                                        src={generalContent.hero.image || '/images/hero-portrait.jpg'} 
                                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                        onLoad={(e) => { (e.target as HTMLImageElement).style.display = 'block'; }}
                                                        alt="Preview" 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-[8px] text-white/50 -z-10">No Image</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs text-white/50 uppercase tracking-widest">Eyebrow</label>
                                            <input 
                                                type="text" 
                                                value={generalContent.hero.eyebrow}
                                                onChange={(e) => updateGeneralContent({...generalContent, hero: {...generalContent.hero, eyebrow: e.target.value}})}
                                                className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:border-brand-accent focus:outline-none"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs text-white/50 uppercase tracking-widest">Title Line 1</label>
                                                <input 
                                                    type="text" 
                                                    value={generalContent.hero.titleLine1}
                                                    onChange={(e) => updateGeneralContent({...generalContent, hero: {...generalContent.hero, titleLine1: e.target.value}})}
                                                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:border-brand-accent focus:outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs text-white/50 uppercase tracking-widest">Title Line 2</label>
                                                <input 
                                                    type="text" 
                                                    value={generalContent.hero.titleLine2}
                                                    onChange={(e) => updateGeneralContent({...generalContent, hero: {...generalContent.hero, titleLine2: e.target.value}})}
                                                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:border-brand-accent focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-white/50 uppercase tracking-widest">Description</label>
                                            <textarea 
                                                value={generalContent.hero.description}
                                                onChange={(e) => updateGeneralContent({...generalContent, hero: {...generalContent.hero, description: e.target.value}})}
                                                className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:border-brand-accent focus:outline-none h-24"
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* PRELOADER SECTION */}
                                    <h3 className="text-brand-accent font-bold uppercase tracking-widest text-sm mb-6 pb-2 border-b border-white/10">Preloader</h3>
                                    <div className="space-y-2 mb-12">
                                        <label className="text-xs text-white/50 uppercase tracking-widest">Loading Words (Comma Separated)</label>
                                        <p className="text-[10px] text-white/30 mb-2">These words cycle on the initial load screen.</p>
                                        <textarea
                                            value={preloaderInput}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setPreloaderInput(val);
                                                // Sync to global context immediately for preview, but clean it up
                                                updateGeneralContent({
                                                    ...generalContent,
                                                    preloader: {
                                                        ...generalContent.preloader,
                                                        words: val.split(',').map(s => s.trim().toUpperCase()).filter(s => s.length > 0)
                                                    }
                                                });
                                            }}
                                            className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:border-brand-accent focus:outline-none h-20 font-mono text-sm"
                                            placeholder="STRATEGY, DESIGN, EXPERIENCE..."
                                        />
                                    </div>

                                    <h3 className="text-brand-accent font-bold uppercase tracking-widest text-sm mb-6 pb-2 border-b border-white/10">Manifesto</h3>
                                    <div className="space-y-6 mb-12">
                                        <div className="space-y-2">
                                            <label className="text-xs text-white/50 uppercase tracking-widest">Section Label</label>
                                            <input 
                                                type="text" 
                                                value={generalContent.manifesto.label}
                                                onChange={(e) => updateGeneralContent({...generalContent, manifesto: {...generalContent.manifesto, label: e.target.value}})}
                                                className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:border-brand-accent focus:outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                             <label className="text-xs text-white/50 uppercase tracking-widest">Main Quote</label>
                                            <textarea 
                                                value={generalContent.manifesto.content}
                                                onChange={(e) => updateGeneralContent({...generalContent, manifesto: {...generalContent.manifesto, content: e.target.value}})}
                                                className="w-full bg-white/5 border border-white/10 rounded px-4 py-4 text-white focus:border-brand-accent focus:outline-none h-32 font-display text-lg"
                                            />
                                        </div>

                                        <div className="space-y-4 border-t border-white/10 pt-6">
                                            <p className="text-xs text-white/50 uppercase tracking-widest">Key Points (3 items)</p>
                                            {generalContent.manifesto.items.map((item, idx) => (
                                                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white/5 rounded border border-white/5">
                                                    <input 
                                                        type="text" 
                                                        value={item.title}
                                                        onChange={(e) => {
                                                            const newItems = [...generalContent.manifesto.items];
                                                            newItems[idx] = {...item, title: e.target.value};
                                                            updateGeneralContent({...generalContent, manifesto: {...generalContent.manifesto, items: newItems}});
                                                        }}
                                                        className="bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:border-brand-accent focus:outline-none"
                                                        placeholder="Title"
                                                    />
                                                    <input 
                                                        type="text" 
                                                        value={item.desc}
                                                        onChange={(e) => {
                                                            const newItems = [...generalContent.manifesto.items];
                                                            newItems[idx] = {...item, desc: e.target.value};
                                                            updateGeneralContent({...generalContent, manifesto: {...generalContent.manifesto, items: newItems}});
                                                        }}
                                                        className="bg-black/20 border border-white/10 rounded px-3 py-2 text-white focus:border-brand-accent focus:outline-none"
                                                        placeholder="Description"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <h3 className="text-brand-accent font-bold uppercase tracking-widest text-sm mb-6 pb-2 border-b border-white/10">Contact Info</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs text-white/50 uppercase tracking-widest">Section Title</label>
                                            <input 
                                                type="text" 
                                                value={generalContent.contact.title}
                                                onChange={(e) => updateGeneralContent({...generalContent, contact: {...generalContent.contact, title: e.target.value}})}
                                                className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:border-brand-accent focus:outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-white/50 uppercase tracking-widest">Description</label>
                                            <textarea 
                                                value={generalContent.contact.description}
                                                onChange={(e) => updateGeneralContent({...generalContent, contact: {...generalContent.contact, description: e.target.value}})}
                                                className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:border-brand-accent focus:outline-none h-24"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs text-white/50 uppercase tracking-widest">Public Email Address</label>
                                            <input 
                                                type="text" 
                                                value={generalContent.contact.email}
                                                onChange={(e) => updateGeneralContent({...generalContent, contact: {...generalContent.contact, email: e.target.value}})}
                                                className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:border-brand-accent focus:outline-none"
                                            />
                                        </div>
                                        
                                        {/* Social Media Inputs */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                                            <div className="space-y-2">
                                                <label className="text-xs text-white/50 uppercase tracking-widest">LinkedIn URL</label>
                                                <input 
                                                    type="text" 
                                                    value={generalContent.contact.socials.linkedin}
                                                    onChange={(e) => updateGeneralContent({...generalContent, contact: {...generalContent.contact, socials: { ...generalContent.contact.socials, linkedin: e.target.value }}})}
                                                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:border-brand-accent focus:outline-none text-sm"
                                                    placeholder="https://linkedin.com/in/..."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs text-white/50 uppercase tracking-widest">Twitter/X URL</label>
                                                <input 
                                                    type="text" 
                                                    value={generalContent.contact.socials.twitter}
                                                    onChange={(e) => updateGeneralContent({...generalContent, contact: {...generalContent.contact, socials: { ...generalContent.contact.socials, twitter: e.target.value }}})}
                                                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:border-brand-accent focus:outline-none text-sm"
                                                    placeholder="https://twitter.com/..."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs text-white/50 uppercase tracking-widest">Instagram URL</label>
                                                <input 
                                                    type="text" 
                                                    value={generalContent.contact.socials.instagram}
                                                    onChange={(e) => updateGeneralContent({...generalContent, contact: {...generalContent.contact, socials: { ...generalContent.contact.socials, instagram: e.target.value }}})}
                                                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white focus:border-brand-accent focus:outline-none text-sm"
                                                    placeholder="https://instagram.com/..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* --- PROJECTS TAB --- */}
                        {activeTab === 'projects' && (
                            <>
                                {/* Hidden Inputs for File Picking */}
                                <input 
                                  type="file" 
                                  ref={imageInputRef} 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={(e) => handleFileSelect(e, 'image')}
                                />
                                <input 
                                  type="file" 
                                  ref={videoInputRef} 
                                  className="hidden" 
                                  accept="video/*"
                                  onChange={(e) => handleFileSelect(e, 'video')}
                                />
                                <input 
                                  type="file" 
                                  ref={galleryInputRef} 
                                  className="hidden" 
                                  accept="image/*"
                                  multiple
                                  onChange={(e) => handleFileSelect(e, 'gallery')}
                                />

                                <div className="w-1/3 overflow-y-auto border-r border-white/10 bg-brand-dark flex flex-col">
                                    <div className="p-6 border-b border-white/10 bg-white/5 flex-shrink-0">
                                        <h4 className="text-brand-accent text-xs font-bold uppercase tracking-widest mb-3">Section Copy</h4>
                                        <div className="space-y-3">
                                            <input 
                                                type="text" 
                                                value={generalContent.projects.title}
                                                onChange={(e) => updateGeneralContent({...generalContent, projects: {...generalContent.projects, title: e.target.value}})}
                                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none"
                                                placeholder="Section Title"
                                            />
                                            <textarea 
                                                value={generalContent.projects.subtitle}
                                                onChange={(e) => updateGeneralContent({...generalContent, projects: {...generalContent.projects, subtitle: e.target.value}})}
                                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none h-20 resize-none"
                                                placeholder="Subtitle"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
                                        <span className="text-xs text-white/30 uppercase tracking-widest">Projects List</span>
                                        <button 
                                            onClick={handleAddProject}
                                            className="text-brand-accent hover:text-white transition-colors flex items-center space-x-1 text-xs font-bold uppercase tracking-wider"
                                        >
                                            <Plus size={14} />
                                            <span>Add New</span>
                                        </button>
                                    </div>
                                    
                                    {/* Draggable List */}
                                    <div className="flex-1 overflow-y-auto">
                                        <Reorder.Group axis="y" values={projects} onReorder={reorderProjects} className="space-y-0">
                                            {projects.map(p => (
                                                <Reorder.Item key={p.id} value={p}>
                                                    <div 
                                                        className={`group flex items-center p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${selectedProjectId === p.id ? 'bg-white/5 border-l-2 border-l-brand-accent' : 'border-l-2 border-l-transparent'}`}
                                                        onClick={() => setSelectedProjectId(p.id)}
                                                    >
                                                        <div className="text-white/20 mr-3 cursor-grab active:cursor-grabbing hover:text-white">
                                                            <GripVertical size={16} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-white font-bold text-sm truncate">{p.title}</h4>
                                                            <p className="text-[10px] text-white/40 truncate">{p.category}</p>
                                                        </div>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); if(window.confirm('Are you sure you want to delete this project?')) { deleteProject(p.id); if(selectedProjectId === p.id) setSelectedProjectId(null); } }}
                                                            className="ml-2 p-2 text-white/10 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                            title="Delete Project"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </Reorder.Item>
                                            ))}
                                        </Reorder.Group>
                                    </div>
                                </div>
                                <div className="w-2/3 overflow-y-auto p-8 bg-brand-gray/30">
                                    {selectedProject ? (
                                        <div className="space-y-6 max-w-2xl mx-auto">
                                            <div className="flex justify-between items-center pb-4 border-b border-white/10">
                                                <h3 className="text-white font-bold text-lg">Editing: <span className="text-brand-accent">{selectedProject.title}</span></h3>
                                                <span className="text-xs font-mono text-white/30">ID: {selectedProject.id}</span>
                                            </div>

                                            {/* Layout Selector */}
                                            <div className="bg-brand-accent/10 border border-brand-accent/20 p-4 rounded-lg flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <Layers className="text-brand-accent" size={20} />
                                                    <div>
                                                        <p className="text-xs uppercase tracking-widest text-brand-accent font-bold">Project Layout</p>
                                                        <p className="text-xs text-white/60">Choose how this project appears in the popup.</p>
                                                    </div>
                                                </div>
                                                <select 
                                                    value={selectedProject.layoutTemplate || 'case-study'}
                                                    onChange={(e) => updateProject({...selectedProject, layoutTemplate: e.target.value as any})}
                                                    className="bg-black/40 border border-brand-accent/30 text-white text-sm rounded px-3 py-2 focus:outline-none"
                                                >
                                                    <option value="case-study">Case Study (Default)</option>
                                                    <option value="gallery">Gallery (Visual Focus)</option>
                                                    <option value="minimal">Minimal (Simple)</option>
                                                </select>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <label className="text-xs text-white/50 uppercase tracking-widest">Project Title</label>
                                                <input type="text" value={selectedProject.title} onChange={(e) => updateProject({...selectedProject, title: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-2 text-xl text-white focus:border-brand-accent focus:outline-none" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs text-white/50 uppercase tracking-widest">Category</label>
                                                    <input type="text" value={selectedProject.category} onChange={(e) => updateProject({...selectedProject, category: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:border-brand-accent focus:outline-none" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs text-white/50 uppercase tracking-widest">Year</label>
                                                    <input type="text" value={selectedProject.year} onChange={(e) => updateProject({...selectedProject, year: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:border-brand-accent focus:outline-none" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs text-white/50 uppercase tracking-widest">Description</label>
                                                <textarea value={selectedProject.description} onChange={(e) => updateProject({...selectedProject, description: e.target.value})} className="w-full bg-transparent border border-white/10 rounded-lg p-4 text-white focus:border-brand-accent focus:outline-none h-32" />
                                            </div>

                                            {/* Project Metrics */}
                                            <div className="space-y-4 pt-4 border-t border-white/5">
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Key Metrics / Story</h4>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs text-white/50 uppercase tracking-widest">The Challenge</label>
                                                        <input 
                                                            type="text" 
                                                            value={selectedProject.challenge || ''} 
                                                            onChange={(e) => updateProject({...selectedProject, challenge: e.target.value})} 
                                                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none" 
                                                            placeholder="Redefining the visual language..."
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs text-white/50 uppercase tracking-widest">The Solution</label>
                                                        <input 
                                                            type="text" 
                                                            value={selectedProject.solution || ''} 
                                                            onChange={(e) => updateProject({...selectedProject, solution: e.target.value})} 
                                                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none" 
                                                            placeholder="We utilized generative design..."
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs text-white/50 uppercase tracking-widest">The Outcome</label>
                                                        <input 
                                                            type="text" 
                                                            value={selectedProject.outcome || ''} 
                                                            onChange={(e) => updateProject({...selectedProject, outcome: e.target.value})} 
                                                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none" 
                                                            placeholder="A significant increase in user engagement..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="p-6 bg-white/5 rounded-lg border border-white/5 space-y-4">
                                                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Media Configuration</h4>
                                                
                                                {/* Image Preview Section */}
                                                <div className="space-y-2">
                                                    <label className="text-xs text-white/50 uppercase tracking-widest flex items-center gap-2">
                                                        <ImageIcon size={12} /> Main Image Path
                                                    </label>
                                                    <div className="flex gap-4 items-start">
                                                        <div className="flex-1 flex gap-2">
                                                            <input type="text" value={selectedProject.image} onChange={(e) => updateProject({...selectedProject, image: e.target.value})} className="flex-1 bg-black/20 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none font-mono" />
                                                            <button onClick={() => imageInputRef.current?.click()} className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded border border-white/10 text-white" title="Browse File">
                                                                <Upload size={16} />
                                                            </button>
                                                        </div>
                                                        <div className="w-20 h-12 bg-black rounded border border-white/10 overflow-hidden flex-shrink-0 relative group">
                                                            <img 
                                                                src={selectedProject.image} 
                                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                                onLoad={(e) => { (e.target as HTMLImageElement).style.display = 'block'; }}
                                                                alt="Preview" 
                                                                className="w-full h-full object-cover" 
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-[8px] text-white/50 -z-10">No Image</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Video Enable Checkbox */}
                                                <div className="space-y-4 pt-4 border-t border-white/5">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={!!selectedProject.video} 
                                                            onChange={(e) => {
                                                                if (!e.target.checked) {
                                                                    updateProject({...selectedProject, video: ''});
                                                                } else {
                                                                    // Default placeholder if creating new, or keep empty to let them browse
                                                                    updateProject({...selectedProject, video: '/videos/projects/placeholder.mp4'}); 
                                                                }
                                                            }}
                                                            className="w-5 h-5 rounded border-white/30 bg-white/5 checked:bg-brand-accent focus:ring-brand-accent cursor-pointer"
                                                        />
                                                        <label className="text-sm text-white font-bold uppercase tracking-widest">Enable Project Video</label>
                                                    </div>
                                                    
                                                    {selectedProject.video && (
                                                        <div className="space-y-2 pl-8">
                                                            <label className="text-xs text-white/50 uppercase tracking-widest flex items-center gap-2">
                                                                <PlayCircle size={12} /> Video Path
                                                            </label>
                                                            <div className="flex gap-4 items-start">
                                                                <div className="flex-1 flex gap-2">
                                                                    <input type="text" value={selectedProject.video || ''} onChange={(e) => updateProject({...selectedProject, video: e.target.value})} className="flex-1 bg-black/20 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none font-mono" />
                                                                    <button onClick={() => videoInputRef.current?.click()} className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded border border-white/10 text-white" title="Browse File">
                                                                        <Upload size={16} />
                                                                    </button>
                                                                </div>
                                                                <div className="w-20 h-12 bg-black rounded border border-white/10 overflow-hidden flex-shrink-0 relative group">
                                                                    <video 
                                                                        src={selectedProject.video}
                                                                        muted
                                                                        loop
                                                                        playsInline
                                                                        autoPlay
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => { (e.target as HTMLVideoElement).style.display = 'none'; }}
                                                                    />
                                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-[8px] text-white/50 -z-10">No Video</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {/* Gallery Inputs */}
                                                <div className="space-y-2 pt-4 border-t border-white/5">
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-xs text-white/50 uppercase tracking-widest flex items-center gap-2">
                                                            <Layers size={12} /> Gallery Images (Comma Separated)
                                                        </label>
                                                        <button onClick={() => galleryInputRef.current?.click()} className="text-xs text-brand-accent hover:text-white flex items-center gap-1 uppercase tracking-wider font-bold">
                                                            <Plus size={12} /> Add Files
                                                        </button>
                                                    </div>
                                                    <textarea 
                                                        value={galleryInput} 
                                                        onChange={(e) => {
                                                            setGalleryInput(e.target.value);
                                                            updateGalleryContext(e.target.value, selectedProject);
                                                        }} 
                                                        className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none h-24 font-mono"
                                                        placeholder="/images/img1.jpg, /images/img2.jpg..."
                                                    />
                                                    
                                                    {/* Visual Gallery Grid */}
                                                    {selectedProject.gallery && selectedProject.gallery.length > 0 && (
                                                        <div className="grid grid-cols-4 gap-2 mt-4 bg-black/20 p-2 rounded-lg border border-white/5">
                                                            {selectedProject.gallery.map((img, idx) => (
                                                                <div key={idx} className="relative group aspect-square bg-black rounded border border-white/10 overflow-hidden">
                                                                    <img 
                                                                        src={img} 
                                                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                                                                        onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.2'; }}
                                                                    />
                                                                    <button 
                                                                        onClick={() => {
                                                                            const newGallery = selectedProject.gallery?.filter((_, i) => i !== idx);
                                                                            updateProject({...selectedProject, gallery: newGallery});
                                                                        }}
                                                                        className="absolute inset-0 bg-red-900/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity backdrop-blur-sm"
                                                                        title="Remove Image"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="text-[10px] text-white/30 italic">
                                                    * Note: The file picker auto-generates the path string. You must still move the physical file to the public/images/projects/ folder manually.
                                                </div>

                                                <div className="space-y-4 pt-2 border-t border-white/5">
                                                    <label className="text-xs text-white/50 uppercase tracking-widest">Card Background Color</label>
                                                    <div className="flex items-start space-x-6">
                                                        <div className="flex flex-col items-center space-y-2">
                                                            <input
                                                                type="color"
                                                                value={getProjectColorHex(selectedProject.color)}
                                                                onChange={(e) => updateProject({...selectedProject, color: e.target.value})}
                                                                className="w-16 h-16 p-1 bg-white/5 border border-white/10 rounded cursor-pointer block"
                                                            />
                                                            <span className="text-[10px] text-white/30 font-mono uppercase">{getProjectColorHex(selectedProject.color)}</span>
                                                        </div>
                                                        <div className="flex-1 text-xs text-white/50 space-y-2">
                                                            <p>
                                                                Click the square to pick a custom background tint for this project card.
                                                            </p>
                                                            <p className="text-white/30">
                                                                Current Value: <span className="font-mono text-brand-accent">{selectedProject.color}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-white/30">
                                            <Layout size={48} className="mb-4 opacity-20" />
                                            <p>Select a project to edit details</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* --- PROCESS TAB --- */}
                        {activeTab === 'process' && (
                             <div className="w-full p-8 overflow-y-auto">
                                <div className="max-w-4xl mx-auto">
                                    <div className="mb-12 p-6 bg-white/5 rounded-xl border border-white/10">
                                        <h4 className="text-brand-accent text-xs font-bold uppercase tracking-widest mb-4">Section Header</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs text-white/50 uppercase tracking-widest">Label</label>
                                                    <input 
                                                        type="text" 
                                                        value={generalContent.process.label}
                                                        onChange={(e) => updateGeneralContent({...generalContent, process: {...generalContent.process, label: e.target.value}})}
                                                        className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs text-white/50 uppercase tracking-widest">Title</label>
                                                    <input 
                                                        type="text" 
                                                        value={generalContent.process.title}
                                                        onChange={(e) => updateGeneralContent({...generalContent, process: {...generalContent.process, title: e.target.value}})}
                                                        className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs text-white/50 uppercase tracking-widest">Description</label>
                                                <textarea 
                                                    value={generalContent.process.description}
                                                    onChange={(e) => updateGeneralContent({...generalContent, process: {...generalContent.process, description: e.target.value}})}
                                                    className="w-full h-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {processSteps.map((step) => (
                                            <div key={step.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-4xl font-display font-bold text-white/10">0{step.id}</span>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs text-white/50 uppercase tracking-widest">Step Title</label>
                                                        <input 
                                                            type="text" 
                                                            value={step.title} 
                                                            onChange={(e) => updateProcessStep({...step, title: e.target.value})} 
                                                            className="w-full bg-transparent border-b border-white/20 py-2 text-lg font-bold text-white focus:border-brand-accent focus:outline-none" 
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs text-white/50 uppercase tracking-widest">Description</label>
                                                        <textarea 
                                                            value={step.description} 
                                                            onChange={(e) => updateProcessStep({...step, description: e.target.value})} 
                                                            className="w-full bg-transparent border border-white/10 rounded p-3 text-white/70 text-sm focus:border-brand-accent focus:outline-none h-32 resize-none" 
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                             </div>
                        )}

                         {/* --- EXPERIENCE TAB --- */}
                         {activeTab === 'experience' && (
                            <>
                                <div className="w-1/3 overflow-y-auto border-r border-white/10 bg-brand-dark">
                                    <div className="p-6 border-b border-white/10 bg-white/5 space-y-4">
                                        <h4 className="text-brand-accent text-xs font-bold uppercase tracking-widest mb-2">Section Headers</h4>
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-white/40 uppercase">Experience Label</label>
                                            <input 
                                                type="text" 
                                                value={generalContent.experience.label}
                                                onChange={(e) => updateGeneralContent({...generalContent, experience: {...generalContent.experience, label: e.target.value}})}
                                                className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-brand-accent focus:outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-white/40 uppercase">Education Label</label>
                                            <input 
                                                type="text" 
                                                value={generalContent.experience.educationLabel}
                                                onChange={(e) => updateGeneralContent({...generalContent, experience: {...generalContent.experience, educationLabel: e.target.value}})}
                                                className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-brand-accent focus:outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-white/40 uppercase">Education Quote</label>
                                            <textarea 
                                                value={generalContent.experience.educationQuote}
                                                onChange={(e) => updateGeneralContent({...generalContent, experience: {...generalContent.experience, educationQuote: e.target.value}})}
                                                className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-brand-accent focus:outline-none h-16 resize-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-4 text-xs font-bold text-brand-accent uppercase tracking-widest">Jobs</div>
                                    {experience.map(e => (
                                        <div 
                                            key={e.id}
                                            onClick={() => { setSelectedJobId(e.id); setSelectedEduId(null); }}
                                            className={`p-6 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${selectedJobId === e.id ? 'bg-white/5 border-l-2 border-l-brand-accent' : ''}`}
                                        >
                                            <h4 className="text-white font-bold mb-1">{e.role}</h4>
                                            <p className="text-xs text-white/40">{e.company}</p>
                                        </div>
                                    ))}
                                    <div className="p-4 mt-8 text-xs font-bold text-brand-accent uppercase tracking-widest">Education</div>
                                    {education.map(e => (
                                        <div 
                                            key={e.id}
                                            onClick={() => { setSelectedEduId(e.id); setSelectedJobId(null); }}
                                            className={`p-6 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${selectedEduId === e.id ? 'bg-white/5 border-l-2 border-l-brand-accent' : ''}`}
                                        >
                                            <h4 className="text-white font-bold mb-1">{e.degree}</h4>
                                            <p className="text-xs text-white/40">{e.institution}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="w-2/3 overflow-y-auto p-8">
                                    {selectedJob && (
                                        <div className="space-y-6">
                                            <h3 className="text-brand-accent font-bold uppercase tracking-widest text-sm mb-6 pb-2 border-b border-white/10">Edit Experience</h3>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs text-white/50 uppercase tracking-widest">Role</label>
                                                    <input type="text" value={selectedJob.role} onChange={(e) => updateExperience({...selectedJob, role: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:border-brand-accent focus:outline-none" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs text-white/50 uppercase tracking-widest">Company</label>
                                                    <input type="text" value={selectedJob.company} onChange={(e) => updateExperience({...selectedJob, company: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:border-brand-accent focus:outline-none" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs text-white/50 uppercase tracking-widest">Period</label>
                                                <input type="text" value={selectedJob.period} onChange={(e) => updateExperience({...selectedJob, period: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:border-brand-accent focus:outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs text-white/50 uppercase tracking-widest">Description</label>
                                                <textarea value={selectedJob.description} onChange={(e) => updateExperience({...selectedJob, description: e.target.value})} className="w-full bg-transparent border border-white/10 rounded-lg p-4 text-white focus:border-brand-accent focus:outline-none h-32" />
                                            </div>
                                        </div>
                                    )}
                                    {selectedEdu && (
                                        <div className="space-y-6">
                                            <h3 className="text-brand-accent font-bold uppercase tracking-widest text-sm mb-6 pb-2 border-b border-white/10">Edit Education</h3>
                                            <div className="space-y-2">
                                                <label className="text-xs text-white/50 uppercase tracking-widest">Degree</label>
                                                <input type="text" value={selectedEdu.degree} onChange={(e) => updateEducation({...selectedEdu, degree: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:border-brand-accent focus:outline-none" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs text-white/50 uppercase tracking-widest">Institution</label>
                                                    <input type="text" value={selectedEdu.institution} onChange={(e) => updateEducation({...selectedEdu, institution: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:border-brand-accent focus:outline-none" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs text-white/50 uppercase tracking-widest">Year</label>
                                                    <input type="text" value={selectedEdu.year} onChange={(e) => updateEducation({...selectedEdu, year: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:border-brand-accent focus:outline-none" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {!selectedJob && !selectedEdu && (
                                        <div className="h-full flex items-center justify-center text-white/30">Select an item to edit</div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* --- SERVICES (CAPABILITIES) TAB --- */}
                        {activeTab === 'services' && (
                             <>
                                <div className="w-1/3 overflow-y-auto border-r border-white/10 bg-brand-dark">
                                    <div className="p-6 border-b border-white/10 bg-white/5 space-y-4">
                                        <h4 className="text-brand-accent text-xs font-bold uppercase tracking-widest mb-2">Section Headers</h4>
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-white/40 uppercase">Label</label>
                                            <input 
                                                type="text" 
                                                value={generalContent.services.label}
                                                onChange={(e) => updateGeneralContent({...generalContent, services: {...generalContent.services, label: e.target.value}})}
                                                className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-brand-accent focus:outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-white/40 uppercase">Title</label>
                                            <input 
                                                type="text" 
                                                value={generalContent.services.title}
                                                onChange={(e) => updateGeneralContent({...generalContent, services: {...generalContent.services, title: e.target.value}})}
                                                className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-brand-accent focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-4 text-xs text-white/30 uppercase tracking-widest">Categories</div>
                                    {capabilities.map((cap, index) => (
                                        <div 
                                            key={index}
                                            onClick={() => setSelectedCapabilityIndex(index)}
                                            className={`p-6 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${selectedCapabilityIndex === index ? 'bg-white/5 border-l-2 border-l-brand-accent' : ''}`}
                                        >
                                            <h4 className="text-white font-bold">{cap.category}</h4>
                                            <p className="text-xs text-white/40">{cap.items.length} items</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="w-2/3 overflow-y-auto p-8">
                                    {selectedCapability && selectedCapabilityIndex !== null ? (
                                        <div className="space-y-8">
                                            <div className="space-y-2">
                                                <label className="text-xs text-white/50 uppercase tracking-widest">Category Name</label>
                                                <input 
                                                    type="text" 
                                                    value={selectedCapability.category} 
                                                    onChange={(e) => {
                                                        const updated = {...selectedCapability, category: e.target.value};
                                                        updateCapabilityCategory(selectedCapabilityIndex, updated);
                                                    }}
                                                    className="w-full bg-transparent border-b border-white/20 py-2 text-xl text-white focus:border-brand-accent focus:outline-none" 
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-4">
                                                    <h3 className="text-brand-accent font-bold uppercase tracking-widest text-sm">Items</h3>
                                                </div>
                                                
                                                {selectedCapability.items.map((item, idx) => (
                                                    <div key={idx} className="bg-white/5 p-4 rounded-lg border border-white/5 space-y-4 relative group">
                                                        <div className="space-y-2">
                                                            <label className="text-xs text-white/30 uppercase tracking-widest">Title</label>
                                                            <input 
                                                                type="text" 
                                                                value={item.title}
                                                                onChange={(e) => {
                                                                    const newItems = [...selectedCapability.items];
                                                                    newItems[idx] = { ...item, title: e.target.value };
                                                                    updateCapabilityCategory(selectedCapabilityIndex, { ...selectedCapability, items: newItems });
                                                                }}
                                                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs text-white/30 uppercase tracking-widest">Description</label>
                                                            <textarea 
                                                                value={item.description}
                                                                onChange={(e) => {
                                                                    const newItems = [...selectedCapability.items];
                                                                    newItems[idx] = { ...item, description: e.target.value };
                                                                    updateCapabilityCategory(selectedCapabilityIndex, { ...selectedCapability, items: newItems });
                                                                }}
                                                                className="w-full bg-black/20 border border-white/10 rounded px-3 py-2 text-sm text-white/70 focus:border-brand-accent focus:outline-none h-20 resize-none"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-white/30">Select a category to edit</div>
                                    )}
                                </div>
                             </>
                        )}

                        {/* --- TESTIMONIALS TAB --- */}
                        {activeTab === 'testimonials' && (
                            <>
                                <input 
                                  type="file" 
                                  ref={testimonialAvatarRef} 
                                  className="hidden" 
                                  accept="image/*"
                                  onChange={(e) => handleFileSelect(e, 'avatar')}
                                />
                                <div className="w-1/3 overflow-y-auto border-r border-white/10 bg-brand-dark">
                                    <div className="p-6 border-b border-white/10 bg-white/5 space-y-4">
                                        <h4 className="text-brand-accent text-xs font-bold uppercase tracking-widest mb-2">Section Headers</h4>
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-white/40 uppercase">Section Title</label>
                                            <input 
                                                type="text" 
                                                value={generalContent.testimonials.title}
                                                onChange={(e) => updateGeneralContent({...generalContent, testimonials: {...generalContent.testimonials, title: e.target.value}})}
                                                className="w-full bg-black/20 border border-white/10 rounded px-2 py-1 text-xs text-white focus:border-brand-accent focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-4 text-xs text-white/30 uppercase tracking-widest">Quotes</div>
                                    {testimonials.map(t => (
                                        <div 
                                            key={t.id}
                                            onClick={() => setSelectedTestimonialId(t.id)}
                                            className={`p-6 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${selectedTestimonialId === t.id ? 'bg-white/5 border-l-2 border-l-brand-accent' : ''}`}
                                        >
                                            <h4 className="text-white font-bold mb-1">{t.name}</h4>
                                            <p className="text-xs text-white/40">{t.company}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="w-2/3 overflow-y-auto p-8">
                                    {selectedTestimonial ? (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs text-white/50 uppercase tracking-widest">Name</label>
                                                    <input type="text" value={selectedTestimonial.name} onChange={(e) => updateTestimonial({...selectedTestimonial, name: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:border-brand-accent focus:outline-none" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs text-white/50 uppercase tracking-widest">Role</label>
                                                    <input type="text" value={selectedTestimonial.role} onChange={(e) => updateTestimonial({...selectedTestimonial, role: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:border-brand-accent focus:outline-none" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs text-white/50 uppercase tracking-widest">Company</label>
                                                <input type="text" value={selectedTestimonial.company} onChange={(e) => updateTestimonial({...selectedTestimonial, company: e.target.value})} className="w-full bg-transparent border-b border-white/20 py-2 text-white focus:border-brand-accent focus:outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs text-white/50 uppercase tracking-widest">Quote</label>
                                                <textarea value={selectedTestimonial.content} onChange={(e) => updateTestimonial({...selectedTestimonial, content: e.target.value})} className="w-full bg-transparent border border-white/10 rounded-lg p-4 text-white focus:border-brand-accent focus:outline-none h-32" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs text-white/50 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={12} /> Avatar Path</label>
                                                <div className="flex gap-4 items-start">
                                                    <div className="flex-1 flex gap-2">
                                                        <input type="text" value={selectedTestimonial.avatar} onChange={(e) => updateTestimonial({...selectedTestimonial, avatar: e.target.value})} className="flex-1 bg-black/20 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-brand-accent focus:outline-none font-mono" />
                                                        <button onClick={() => testimonialAvatarRef.current?.click()} className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded border border-white/10 text-white" title="Browse File">
                                                            <Upload size={16} />
                                                        </button>
                                                    </div>
                                                    <div className="w-12 h-12 bg-black rounded-full border border-white/10 overflow-hidden flex-shrink-0 relative group">
                                                        <img 
                                                            src={selectedTestimonial.avatar} 
                                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                            onLoad={(e) => { (e.target as HTMLImageElement).style.display = 'block'; }}
                                                            alt="Preview" 
                                                            className="w-full h-full object-cover" 
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-[8px] text-white/50 -z-10">?</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-white/30">Select a testimonial to edit</div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* --- HELP TAB --- */}
                        {activeTab === 'help' && (
                            <div className="p-12 max-w-3xl mx-auto text-white/80 space-y-8 overflow-y-auto">
                                <div className="bg-brand-accent/10 border border-brand-accent/20 p-6 rounded-xl">
                                    <h3 className="text-brand-accent font-bold text-lg mb-2">Saving Changes</h3>
                                    <p className="text-sm leading-relaxed">
                                        All edits are currently saved in your browser's memory (LocalStorage). To publish them:
                                    </p>
                                </div>

                                <ol className="list-decimal space-y-6 pl-4">
                                    <li className="pl-2">
                                        <span className="font-bold text-white">Click "Save Config".</span> This downloads <code>constants_export.ts</code>.
                                    </li>
                                    <li className="pl-2">
                                        <span className="font-bold text-white">Update Source Code.</span> Rename the file to <code>constants.ts</code> and replace the file in your project's <code>src</code> folder.
                                    </li>
                                    <li className="pl-2">
                                        <span className="font-bold text-white">Deploy.</span> Commit and push to GitHub.
                                    </li>
                                </ol>
                                
                                <div className="border-t border-white/10 pt-8 mt-8">
                                    <h3 className="text-white font-bold text-lg mb-4">Adding Media</h3>
                                    <p className="text-sm text-white/60 mb-4">
                                        When adding new images or videos, use the "Browse" button to auto-generate the path.
                                    </p>
                                    <div className="p-4 bg-white/5 rounded border border-white/5">
                                        <p className="text-sm text-brand-accent font-bold mb-2">IMPORTANT:</p>
                                        <p className="text-sm text-white/60">
                                            The browser cannot upload files directly to your project folder. 
                                            After selecting a file, you must manually move that file into the corresponding folder:
                                        </p>
                                        <ul className="list-disc pl-6 space-y-2 text-sm font-mono text-white/50 mt-2">
                                            <li>public/images/projects/</li>
                                            <li>public/videos/projects/</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdminPanel;

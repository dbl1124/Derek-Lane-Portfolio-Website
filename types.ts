

export interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
  video?: string; // Path to the video file
  color: string;
  layoutTemplate?: 'case-study' | 'gallery' | 'minimal';
  gallery?: string[]; // Array of image URLs for the gallery layout
  
  // New metrics fields
  challenge?: string;
  solution?: string;
  outcome?: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'Strategy' | 'Design' | 'Tech';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

export interface ProcessStep {
  id: number;
  title: string;
  description: string;
}

export interface ExperienceItem {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface EducationItem {
  id: number;
  degree: string;
  institution: string;
  year: string;
}

export interface CapabilityItem {
  title: string;
  description: string;
}

export interface CapabilityCategory {
  category: string;
  items: CapabilityItem[];
}

export interface ManifestoItem {
  number: string;
  title: string;
  desc: string;
}

export interface GeneralContent {
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    image: string; // Added image field
  };
  // New Preloader Config
  preloader: {
    words: string[];
  };
  manifesto: {
    label: string;
    content: string;
    items: ManifestoItem[];
  };
  projects: {
    title: string;
    subtitle: string;
  };
  process: {
    label: string;
    title: string;
    description: string;
  };
  experience: {
    label: string;
    educationLabel: string;
    educationQuote: string;
  };
  services: {
    label: string;
    title: string;
  };
  testimonials: {
    title: string;
  };
  contact: {
    title: string;
    description: string;
    email: string;
    socials: {
      instagram: string;
      twitter: string;
      linkedin: string;
    }
  };
}
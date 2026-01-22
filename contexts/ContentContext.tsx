
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Project, GeneralContent, ProcessStep, ExperienceItem, EducationItem, CapabilityCategory, Testimonial } from '../types';
import { 
  PROJECTS as INITIAL_PROJECTS, 
  GENERAL_CONTENT as INITIAL_GENERAL_CONTENT,
  PROCESS_STEPS as INITIAL_PROCESS_STEPS,
  EXPERIENCE as INITIAL_EXPERIENCE,
  EDUCATION as INITIAL_EDUCATION,
  CAPABILITIES as INITIAL_CAPABILITIES,
  TESTIMONIALS as INITIAL_TESTIMONIALS,
  CONTENT_VERSION
} from '../constants';

interface ContentContextType {
  projects: Project[];
  updateProject: (updatedProject: Project) => void;
  addProject: () => number; // Returns the ID of the new project
  deleteProject: (id: number) => void;
  reorderProjects: (projects: Project[]) => void;
  generalContent: GeneralContent;
  updateGeneralContent: (updatedContent: GeneralContent) => void;
  processSteps: ProcessStep[];
  updateProcessStep: (updatedStep: ProcessStep) => void;
  experience: ExperienceItem[];
  updateExperience: (updatedItem: ExperienceItem) => void;
  education: EducationItem[];
  updateEducation: (updatedItem: EducationItem) => void;
  capabilities: CapabilityCategory[];
  updateCapabilityCategory: (index: number, updatedCategory: CapabilityCategory) => void;
  testimonials: Testimonial[];
  updateTestimonial: (updatedTestimonial: Testimonial) => void;
  resetData: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [generalContent, setGeneralContent] = useState<GeneralContent>(INITIAL_GENERAL_CONTENT);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(INITIAL_PROCESS_STEPS);
  const [experience, setExperience] = useState<ExperienceItem[]>(INITIAL_EXPERIENCE);
  const [education, setEducation] = useState<EducationItem[]>(INITIAL_EDUCATION);
  const [capabilities, setCapabilities] = useState<CapabilityCategory[]>(INITIAL_CAPABILITIES);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);

  // Load from localStorage on mount to persist "Draft" edits across refreshes
  useEffect(() => {
    // VERSION CHECK:
    // If the version in local storage (or lack thereof) is different from the code version,
    // we assume a new deployment has occurred and we should WIPE local storage to show fresh content.
    const storedVersion = localStorage.getItem('content_version');
    
    if (storedVersion !== CONTENT_VERSION) {
        console.log("New content version detected. Clearing cached drafts.");
        localStorage.removeItem('admin_projects_draft');
        localStorage.removeItem('admin_general_draft');
        localStorage.removeItem('admin_process_draft');
        localStorage.removeItem('admin_experience_draft');
        localStorage.removeItem('admin_education_draft');
        localStorage.removeItem('admin_capabilities_draft');
        localStorage.removeItem('admin_testimonials_draft');
        
        // Update stored version to match current
        localStorage.setItem('content_version', CONTENT_VERSION);
        return; // Don't load anything, rely on INITIAL_... states
    }

    const loadState = (key: string, setter: React.Dispatch<React.SetStateAction<any>>) => {
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          setter(JSON.parse(saved));
        } catch (e) {
          console.error(`Failed to load ${key}`, e);
        }
      }
    };

    loadState('admin_projects_draft', setProjects);
    loadState('admin_general_draft', setGeneralContent);
    loadState('admin_process_draft', setProcessSteps);
    loadState('admin_experience_draft', setExperience);
    loadState('admin_education_draft', setEducation);
    loadState('admin_capabilities_draft', setCapabilities);
    loadState('admin_testimonials_draft', setTestimonials);
  }, []);

  const updateProject = (updatedProject: Project) => {
    const newProjects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
    setProjects(newProjects);
    localStorage.setItem('admin_projects_draft', JSON.stringify(newProjects));
    localStorage.setItem('content_version', CONTENT_VERSION);
  };

  const addProject = () => {
    // Calculate new ID based on max existing ID to ensure uniqueness
    const maxId = projects.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const newId = maxId + 1;
    
    const newProject: Project = {
      id: newId,
      title: `New Project ${newId}`,
      category: "Concept",
      year: new Date().getFullYear().toString(),
      description: "This is a placeholder for a new project. Content and media should be updated in the admin panel.",
      // Automatic naming convention for easy file replacement
      image: `/images/projects/project${newId}.jpg`,
      video: `/videos/projects/project${newId}.mp4`,
      color: "bg-zinc-900", // Neutral default
      layoutTemplate: 'case-study',
      gallery: []
    };

    const newProjects = [...projects, newProject];
    setProjects(newProjects);
    localStorage.setItem('admin_projects_draft', JSON.stringify(newProjects));
    localStorage.setItem('content_version', CONTENT_VERSION);
    
    return newId;
  };

  const deleteProject = (id: number) => {
    const newProjects = projects.filter(p => p.id !== id);
    setProjects(newProjects);
    localStorage.setItem('admin_projects_draft', JSON.stringify(newProjects));
    localStorage.setItem('content_version', CONTENT_VERSION);
  };

  const reorderProjects = (newProjects: Project[]) => {
    setProjects(newProjects);
    localStorage.setItem('admin_projects_draft', JSON.stringify(newProjects));
    localStorage.setItem('content_version', CONTENT_VERSION);
  };

  const updateGeneralContent = (updatedContent: GeneralContent) => {
    setGeneralContent(updatedContent);
    localStorage.setItem('admin_general_draft', JSON.stringify(updatedContent));
    localStorage.setItem('content_version', CONTENT_VERSION);
  };

  const updateProcessStep = (updatedStep: ProcessStep) => {
    const newSteps = processSteps.map(s => s.id === updatedStep.id ? updatedStep : s);
    setProcessSteps(newSteps);
    localStorage.setItem('admin_process_draft', JSON.stringify(newSteps));
    localStorage.setItem('content_version', CONTENT_VERSION);
  };

  const updateExperience = (updatedItem: ExperienceItem) => {
    const newExperience = experience.map(e => e.id === updatedItem.id ? updatedItem : e);
    setExperience(newExperience);
    localStorage.setItem('admin_experience_draft', JSON.stringify(newExperience));
    localStorage.setItem('content_version', CONTENT_VERSION);
  };

  const updateEducation = (updatedItem: EducationItem) => {
    const newEducation = education.map(e => e.id === updatedItem.id ? updatedItem : e);
    setEducation(newEducation);
    localStorage.setItem('admin_education_draft', JSON.stringify(newEducation));
    localStorage.setItem('content_version', CONTENT_VERSION);
  };

  const updateCapabilityCategory = (index: number, updatedCategory: CapabilityCategory) => {
    const newCapabilities = [...capabilities];
    newCapabilities[index] = updatedCategory;
    setCapabilities(newCapabilities);
    localStorage.setItem('admin_capabilities_draft', JSON.stringify(newCapabilities));
    localStorage.setItem('content_version', CONTENT_VERSION);
  };

  const updateTestimonial = (updatedTestimonial: Testimonial) => {
    const newTestimonials = testimonials.map(t => t.id === updatedTestimonial.id ? updatedTestimonial : t);
    setTestimonials(newTestimonials);
    localStorage.setItem('admin_testimonials_draft', JSON.stringify(newTestimonials));
    localStorage.setItem('content_version', CONTENT_VERSION);
  };

  const resetData = () => {
    setProjects(INITIAL_PROJECTS);
    setGeneralContent(INITIAL_GENERAL_CONTENT);
    setProcessSteps(INITIAL_PROCESS_STEPS);
    setExperience(INITIAL_EXPERIENCE);
    setEducation(INITIAL_EDUCATION);
    setCapabilities(INITIAL_CAPABILITIES);
    setTestimonials(INITIAL_TESTIMONIALS);

    localStorage.removeItem('admin_projects_draft');
    localStorage.removeItem('admin_general_draft');
    localStorage.removeItem('admin_process_draft');
    localStorage.removeItem('admin_experience_draft');
    localStorage.removeItem('admin_education_draft');
    localStorage.removeItem('admin_capabilities_draft');
    localStorage.removeItem('admin_testimonials_draft');
    // Ensure we are in sync
    localStorage.setItem('content_version', CONTENT_VERSION);
  };

  return (
    <ContentContext.Provider value={{ 
        projects, updateProject, addProject, deleteProject, reorderProjects,
        generalContent, updateGeneralContent,
        processSteps, updateProcessStep,
        experience, updateExperience,
        education, updateEducation,
        capabilities, updateCapabilityCategory,
        testimonials, updateTestimonial,
        resetData 
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

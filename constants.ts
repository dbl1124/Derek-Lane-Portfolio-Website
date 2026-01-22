

import { Project, Testimonial, Skill, ProcessStep, ExperienceItem, EducationItem, GeneralContent, CapabilityCategory } from './types';

// Updated: 2025-11-30T06:00:00.000Z
export const CONTENT_VERSION = "2025-11-30T06:00:00.000Z";

export const GENERAL_CONTENT: GeneralContent = {
  "hero": {
    "eyebrow": "Creative Director",
    "titleLine1": "I Concept, Direct, and Deliver",
    "titleLine2": "",
    "description": "Creative that's strategic, beautifully executed, and measurably effective.",
    "image": "/images/hero-portrait.jpg"
  },
  "preloader": {
    "words": ["STRATEGY", "DESIGN", "EXPERIENCE", "INNOVATION", "IMMERSION"]
  },
  "manifesto": {
    "label": "The Manifesto",
    "content": "I direct creative that solves problems and drives results. For over ten years, I've led campaigns and built teams in environments where design had to prove its value before anyone took it seriously. But results don't mean sacrificing craft—I lead with strategy and execute with care. Great creative proves itself through performance, through impact, through work people can't ignore.",
    "items": [
      {
        "number": "01",
        "title": "Strategy Drives Everything",
        "desc": "Creative without strategy is just aesthetics. I start with the business problem, then solve it with design."
      },
      {
        "number": "02",
        "title": "Prove it with Design",
        "desc": "Every campaign, every asset, every decision—measured against outcomes. Creative earns credibility through results."
      },
      {
        "number": "03",
        "title": "Build for Scale",
        "desc": "Great work once doesn't matter. I build teams, systems, and processes that make great work repeatable."
      }
    ]
  },
  "projects": {
    "title": "Selected Works",
    "subtitle": "Product launches. Brand systems. E-commerce creative. \nWork that delivers."
  },
  "process": {
    "label": "The Blueprint",
    "title": "Methodology",
    "description": "Standout creative comes from a clear process. Here's insight into mine."
  },
  "experience": {
    "label": "The Trajectory",
    "educationLabel": "Education",
    "educationQuote": "Strategy, craft, and follow-through. Most creative directors are strong at one. I bring all three."
  },
  "services": {
    "label": "Services",
    "title": "Capabilities"
  },
  "testimonials": {
    "title": "Trusted By Visionaries"
  },
  "contact": {
    "title": "Get in Touch.",
    "description": "Always interested in connecting with like-minded creatives and discussing the future of design.",
    "email": "hello@dereklane.design",
    "socials": {
      "instagram": "#",
      "twitter": "#",
      "linkedin": "#"
    }
  }
};

export const MANIFESTO = GENERAL_CONTENT.manifesto.content;

export const PROJECTS: Project[] = [
  {
    "id": 1,
    "title": "Neon Horizon",
    "category": "Brand Identity",
    "year": "2024",
    "description": "A complete rebrand for a fintech unicorn, focusing on kinetic typography and electric color palettes to signify speed and innovation.",
    "image": "/images/projects/project1.jpg",
    "video": "/videos/projects/project1.mp4",
    "color": "bg-purple-900",
    "layoutTemplate": "case-study",
    "gallery": [
      "/images/projects/project1.jpg",
      "/images/projects/project5.jpg",
      "/images/projects/project3.jpg"
    ],
    "challenge": "Redefining the visual language in a saturated market.",
    "solution": "We utilized generative design patterns coupled with strict typographic rules.",
    "outcome": "A significant increase in user engagement and brand perception."
  },
  {
    "id": 2,
    "title": "EcoStructure",
    "category": "Spatial Design",
    "year": "2023",
    "description": "Interactive installation for the World Climate Summit. Using real-time data to visualize carbon footprint reduction in urban environments.",
    "image": "/images/projects/project2.jpg",
    "video": "/videos/projects/project2.mp4",
    "color": "bg-emerald-900",
    "layoutTemplate": "gallery",
    "gallery": [
      "/images/projects/project2.jpg",
      "/images/projects/project6.jpg",
      "/images/projects/project4.jpg",
      "/images/projects/project1.jpg"
    ],
    "challenge": "Visualizing invisible data in a way that evokes emotional response.",
    "solution": "Created an immersive AR overlay that mapped carbon data to physical space.",
    "outcome": "Featured in major design publications and increased summit attendance."
  },
  {
    "id": 3,
    "title": "Velvet Audio",
    "category": "Digital Product",
    "year": "2023",
    "description": "UI/UX design for a high-fidelity streaming app. Focusing on dark mode aesthetics and haptic feedback patterns.",
    "image": "/images/projects/project3.jpg",
    "video": "/videos/projects/project3.mp4",
    "color": "bg-rose-900",
    "layoutTemplate": "minimal",
    "challenge": "Competing with established giants while offering a premium feel.",
    "solution": "Focused on tactile UI elements and a rich, cinematic dark mode.",
    "outcome": "Achieved 4.9 star rating on App Store within first month."
  },
  {
    "id": 4,
    "title": "Mono/Chrome",
    "category": "Art Direction",
    "year": "2022",
    "description": "Fashion editorial campaign for a luxury streetwear brand. Minimalist, stark contrast, and bold geometric composition.",
    "image": "/images/projects/project4.jpg",
    "video": "/videos/projects/project4.mp4",
    "color": "bg-slate-800",
    "layoutTemplate": "gallery",
    "gallery": [
      "/images/projects/project4.jpg",
      "/images/projects/project5.jpg",
      "/images/projects/project2.jpg"
    ],
    "challenge": "Cutting through the noise of maximalist streetwear trends.",
    "solution": "A strict monochrome palette and brutalist composition style.",
    "outcome": "Sold out collection within 24 hours of campaign launch."
  },
  {
    "id": 5,
    "title": "Aether Lens",
    "category": "AR Experience",
    "year": "2022",
    "description": "Augmented reality retail experience allowing users to visualize avant-garde fashion pieces in their own physical space before purchasing.",
    "image": "/images/projects/project5.jpg",
    "video": "/videos/projects/project5.mp4",
    "color": "bg-indigo-900",
    "layoutTemplate": "case-study",
    "challenge": "Reducing return rates for high-ticket fashion items.",
    "solution": "High-fidelity AR models with accurate fabric physics.",
    "outcome": "Reduced returns by 40% and increased conversion by 25%."
  },
  {
    "id": 6,
    "title": "Kinetix Labs",
    "category": "Data Visualization",
    "year": "2021",
    "description": "Real-time sports analytics dashboard for professional coaching staff, translating complex biometrics into actionable visual insights.",
    "image": "/images/projects/project6.jpg",
    "video": "/videos/projects/project6.mp4",
    "color": "bg-orange-900",
    "layoutTemplate": "minimal",
    "challenge": "Making complex biometric data digestible for coaches in real-time.",
    "solution": "A simplified, high-contrast dashboard with predictive alerts.",
    "outcome": "Adopted by 3 major league teams for the 2022 season."
  }
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    "id": 1,
    "title": "Understanding the Problem",
    "description": "I start by gathering information before I make anything. What's the business objective? Who's buying and why? The goal is to understand the real problem we're solving, not the one we assume exists."
  },
  {
    "id": 2,
    "title": "Concept with\nStrategy",
    "description": "Once I know what we're solving for, I develop concepts that connect business needs to creative execution.  The idea comes from what we learned in research, not from what looks cool in a vacuum."
  },
  {
    "id": 3,
    "title": "Execute with\nCraft",
    "description": "Strategy sets the direction, but execution determines whether people pay attention. I direct work that's appropriate for the medium and the audience. I stay hands-on through production to ensure quality."
  },
  {
    "id": 4,
    "title": "Prove It and\nScale It",
    "description": "After launch, I track what actually happened.  If it worked, I document why and build it into our process. If it didn't, I figure out what to change. Then I create the systems that let us repeat successful work consistently."
  }
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    "id": 1,
    "role": "Creative Director",
    "company": "Apex Tool Group",
    "period": "2022 - Present",
    "description": "Direct digital creative for multiple tool brands—leading integrated campaigns, building high-performing teams, and proving creative drives measurable business results."
  },
  {
    "id": 2,
    "role": "Art Director",
    "company": "Apex Tool Group",
    "period": "2020 - 2022",
    "description": "Art directed e-commerce creative, Amazon brand stores, and digital campaigns while establishing design systems that scaled across multiple brands."
  },
  {
    "id": 3,
    "role": "Sr 3D Animator/Designer",
    "company": "Apex Tool Group",
    "period": "2018 - 2020",
    "description": "Built 3D animation capability in-house and shifted product content from technical demonstrations to narrative-driven storytelling that outperformed agency work."
  }
];

export const EDUCATION: EducationItem[] = [
  {
    "id": 1,
    "degree": "MA, Architecture",
    "institution": "North Carolina State University",
    "year": "2006-2009"
  },
  {
    "id": 2,
    "degree": "BFA, Graphic Design",
    "institution": "East Carolina University",
    "year": "2000-2005"
  }
];

export const CAPABILITIES: CapabilityCategory[] = [
  {
    "category": "Strategy",
    "items": [
      {
        "title": "Creative Strategy",
        "description": "Connecting business objectives to creative execution. Every campaign starts with understanding what we're solving for and who we're talking to."
      },
      {
        "title": "Campaign Development",
        "description": "Building integrated campaigns from positioning through execution—3D content, e-commerce creative, digital advertising, and in-store support."
      },
      {
        "title": "Brand Positioning",
        "description": "Defining how brands show up in market and what makes them different. Especially important in B2B manufacturing where differentiation isn't obvious."
      },
      {
        "title": "Research & Insights",
        "description": "Voice of customer feedback, sales data, competitive analysis, and direct user input. Good creative comes from understanding the problem first."
      },
      {
        "title": "Concept Development",
        "description": "Turning strategy into ideas that work across channels. Product storytelling for e-commerce, campaign narratives for launches, visual systems that scale."
      }
    ]
  },
  {
    "category": "Creative Direction",
    "items": [
      {
        "title": "Integrated Campaigns",
        "description": "Leading creative from concept through execution across digital advertising, e-commerce, email, and in-store. Making sure the work connects, not just coexists."
      },
      {
        "title": "Product Launch Creative",
        "description": "Directing campaigns for new products—positioning, messaging, 3D content, paid social, Amazon optimization. Work that drives awareness and conversion."
      },
      {
        "title": "Art Direction",
        "description": "Setting visual tone and ensuring quality across all touchpoints. From photorealistic 3D renders to email templates to brand store layouts."
      },
      {
        "title": "Visual Storytelling",
        "description": "Shifting product content from technical specifications to narratives that connect with end users. Stories sell better than features."
      },
      {
        "title": "Digital Advertising",
        "description": "Creating and directing creative for Facebook, Instagram, Google ads. Optimized for the platform, built to perform in A/B tests."
      }
    ]
  },
  {
    "category": "3D & Animation",
    "items": [
      {
        "title": "Product Visualization",
        "description": "Photorealistic 3D rendering using Cinema 4D and SketchUp. Product shots, exploded views, context scenes—whatever tells the story best."
      },
      {
        "title": "3D Animation & Rendering",
        "description": "Narrative-driven animations that demonstrate product benefits in action. Consistently outperforms traditional photography and video."
      },
      {
        "title": "Motion Graphics",
        "description": "Bringing static assets to life with kinetic energy and pacing that holds attention in feeds and on product pages."
      },
      {
        "title": "Narrative-Driven Content",
        "description": "3D work that tells stories, not just shows features. Connecting emotionally with mechanics, construction workers, and industrial buyers."
      },
      {
        "title": "Technical Product Demonstration",
        "description": "Showing how complex products work through animation. Clearer than live video, more engaging than diagrams."
      }
    ]
  },
  {
    "category": "Design & Production",
    "items": [
      {
        "title": "E-commerce Creative",
        "description": "Amazon brand stores, product detail pages, digital shelf optimization. Creative built to convert in e-commerce environments."
      },
      {
        "title": "Email Design Systems",
        "description": "Scalable templates and design systems that balance brand consistency with campaign flexibility. Proven to improve open rates and clicks."
      },
      {
        "title": "Packaging & Merchandising",
        "description": "Designing for retail shelf presence and unboxing experience. Understanding how products compete in physical and digital retail."
      },
      {
        "title": "Print Production",
        "description": "Trade show graphics, sell sheets, in-store signage. Production-ready files that account for materials, printing methods, and real-world constraints."
      },
      {
        "title": "Brand Systems",
        "description": "Visual identity, typography, color systems, and design standards that scale across teams and channels."
      }
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    "id": 1,
    "name": "Sarah Jenkins",
    "role": "CMO",
    "company": "TechFlow",
    "content": "Their vision is unparallelled. They took a vague concept and turned it into a visual language that defines our entire industry now.",
    "avatar": "/images/testimonials/sarah.jpg"
  },
  {
    "id": 2,
    "name": "Marcus Chen",
    "role": "Founder",
    "company": "Apex Studios",
    "content": "A true master of the craft. The attention to micro-interactions and user delight is what separates their work from the rest.",
    "avatar": "/images/testimonials/marcus.jpg"
  }
];

// Legacy Skills Data
export const SKILLS: Skill[] = [
  { name: "Creative Direction", level: 95, category: "Strategy" },
  { name: "Brand Strategy", level: 90, category: "Strategy" },
  { name: "UI/UX Design", level: 88, category: "Design" },
  { name: "Motion Graphics", level: 85, category: "Design" },
  { name: "3D Prototyping", level: 75, category: "Design" },
  { name: "Frontend Dev", level: 70, category: "Tech" },
];
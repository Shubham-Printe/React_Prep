export interface Skill {
  name: string;
  level: number;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export interface ExperienceEntry {
  title: string;
  company: string;
  duration: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface ProjectEntry {
  title: string;
  description: string;
  features: string[];
  category: string;
  status: string;
  technologies: string[];
  imageUrl?: string;
  demoUrl?: string;
  codeUrl?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  resumeUrl?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

export interface Stats {
  projects: string;
  years: string;
  satisfaction: string;
}

export interface AboutInfo {
  sectionTitle: string;
  description1: string;
  description2: string;
  interestsTitle: string;
  interests: string[];
}

export interface Branding {
  primaryColors: string[];
  particleColors: string[];
  logoText: string;
  gradients: {
    hero: string;
    about: string;
    experience: string;
    skills: string;
    projects: string;
    contact: string;
  };
}

export interface Config {
  showParticles: boolean;
  particleCount: number;
  defaultTheme: 'light' | 'dark';
  defaultLanguage: 'en' | 'es';
  sections: {
    hero: boolean;
    about: boolean;
    experience: boolean;
    skills: boolean;
    projects: boolean;
    contact: boolean;
  };
}

export interface PortfolioData {
  personal: {
    name: string;
    title: string;
    subtitle: string;
    description: string;
    initials: string;
    avatar?: string;
  };
  contact: ContactInfo;
  stats: Stats;
  skills: {
    technical: SkillCategory[];
    soft: string[];
    quick: string[];
  };
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  about: AboutInfo;
  branding: Branding;
  config: Config;
}

// Default portfolio data - replace this with your actual data
export const portfolioData: PortfolioData = {
  personal: {
    name: "Shubham Printe",
    title: "Senior Full-Stack Engineer",
    subtitle: "Full-stack engineer building production web apps (React, TypeScript) and backend services (Node.js, REST APIs).",
    description: "Full-stack engineer with 4+ years building production web applications (React, TypeScript) and 2–3 years hands-on backend development (Node.js, REST APIs). Strong in API design, integration patterns, and cross-team coordination. Owns features end-to-end from API to UI; comfortable with complex configurations, customizations, and performance optimization in enterprise implementations.",
    initials: "SP",
    avatar: "/profile-photo.jpeg", // Profile photo from public directory
  },
  
  contact: {
    email: "shubhamprinte99@gmail.com",
    phone: "901-160-0097",
    location: "Pune, India 411045",
    resumeUrl: "/Resume.pdf", // Add your resume URL
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/shubham-printe-8548aa162",
    },
  },
  
  stats: {
    projects: "20+",
    years: "4+",
    satisfaction: "95%",
  },
  
  skills: {
    technical: [
      {
        title: "Frontend",
        skills: [
          { name: "React", level: 95 },
          { name: "TypeScript", level: 92 },
          { name: "Next.js", level: 90 },
          { name: "JavaScript (ES6+)", level: 90 },
          { name: "Redux", level: 85 },
          { name: "HTML/CSS", level: 85 },
          { name: "Material UI", level: 85 },
          { name: "Code Splitting", level: 85 },
          { name: "Performance Optimization", level: 85 },
          { name: "Responsive Design", level: 88 },
        ]
      },
      {
        title: "Backend & APIs",
        skills: [
          { name: "Node.js", level: 85 },
          { name: "REST API Design", level: 88 },
          { name: "Express / Fastify", level: 82 },
          { name: "Validation & Error Handling", level: 85 },
          { name: "Structured Logging", level: 80 },
          { name: "Integration Patterns", level: 85 },
          { name: "Axios", level: 88 },
        ]
      },
      {
        title: "Tools & Practices",
        skills: [
          { name: "Git", level: 90 },
          { name: "CI/CD", level: 80 },
          { name: "OAuth / JWT", level: 78 },
          { name: "Documentation", level: 82 },
          { name: "Code Reviews", level: 88 },
          { name: "Jira", level: 75 },
          { name: "Postman", level: 80 },
        ]
      },
    ],
    soft: [
      "Team Leadership",
      "Cross-Functional Collaboration",
      "Mentoring",
      "Code Review",
      "API Design & Integration",
      "Performance Optimization",
      "Problem Solving",
      "Communication",
      "End-to-End Ownership"
    ],
    quick: [
      "React",
      "TypeScript",
      "Node.js",
      "REST APIs",
      "Next.js",
      "Fastify"
    ],
  },
  
  experience: [
    {
      title: "Senior Full-Stack Engineer",
      company: "Digitalpha (Hello Chapter)",
      duration: "01/2024 - Current",
      description: "Full-stack ownership across web applications and content sites. Design and develop REST APIs and Node.js services; build and maintain React (TypeScript) frontends. Technical leadership: mentoring, code reviews, and scalable architecture.",
      achievements: [
        "Full-stack ownership for three web applications (client, internal, contractor) and content site for a US-based home renovation company (NYC & Miami)",
        "Design and develop REST APIs and Node.js services; own API contracts, request/response validation, and integration patterns",
        "Build and maintain React (TypeScript) frontends: component architecture, state management, code splitting, memoization, responsive UIs",
        "Deliver complex features end-to-end: Draft.js content editing, Gantt timelines, live camera feeds, Tableau dashboards",
        "Mentor team of three developers; own technical design and code reviews across frontend and backend",
        "Drive customizations and configuration for client workflows; troubleshoot and optimize performance in production",
        "Coordinate with design and stakeholders to ship features from API to UI; align with enterprise release and deployment"
      ],
      technologies: ["React", "TypeScript", "Next.js", "Node.js", "REST APIs", "Express/Fastify", "Redux", "Material UI", "SCSS", "Git", "CI/CD"]
    },
    {
      title: "Software Engineer",
      company: "Digitalpha",
      duration: "03/2023 - 12/2023",
      description: "Full-stack development: advanced React.js features and performance optimization on the frontend; contribution to Node.js services and REST API integration. Cross-team collaboration for end-to-end delivery.",
      achievements: [
        "Developed and deployed 15+ frontend features and contributed to backend API integration across multiple client projects",
        "Optimized frontend performance resulting in 35% faster load times; improved API request/response handling",
        "Collaborated with design and backend teams to deliver seamless user experiences and consistent data contracts",
        "Implemented responsive designs ensuring 100% mobile compatibility",
        "Contributed to code review processes and API validation patterns, improving overall code quality by 25%"
      ],
      technologies: ["React.js", "TypeScript", "JavaScript", "Node.js", "REST APIs", "Material UI", "Git", "Agile"]
    },
    {
      title: "Associate Software Engineer",
      company: "Digitalpha",
      duration: "06/2022 - 02/2023",
      description: "Frontend development with growing involvement in API integration and backend collaboration. Component development, state management, and participation in API design and validation discussions.",
      achievements: [
        "Built 20+ reusable React components improving development efficiency by 40%",
        "Fixed critical production bugs reducing customer complaints by 50%; coordinated with backend on error handling and data contracts",
        "Implemented state management (Context API, Redux) and integrated with REST APIs",
        "Participated in sprint planning, API design discussions, and agile development processes",
        "Improved application accessibility compliance to WCAG 2.1 standards"
      ],
      technologies: ["React.js", "JavaScript", "HTML/CSS", "Material UI", "Redux", "Context API", "REST APIs"]
    },
    {
      title: "Intern Software Developer - React.js",
      company: "Digitalpha",
      duration: "10/2021 - 05/2022",
      description: "Entry-level frontend role: React.js fundamentals, UI development, and exposure to API integration and backend collaboration.",
      achievements: [
        "Successfully completed 8-month internship with exceptional performance ratings",
        "Developed 10+ UI components following company design standards",
        "Learned and applied React.js, JavaScript ES6+, and API integration patterns with backend services",
        "Collaborated with senior developers on feature implementation and bug fixes",
        "Demonstrated rapid learning ability leading to early promotion"
      ],
      technologies: ["React.js", "JavaScript", "HTML/CSS", "Git", "VS Code"]
    },
    {
      title: "React Developer",
      company: "Dogra Technologies Pvt. Ltd.",
      duration: "12/2020 - 04/2021",
      description: "Frontend ownership with API integration focus: bug fixing, stability improvements, and participation in API design and request/response validation with the backend team.",
      achievements: [
        "Resolved critical bugs, cutting crashes by 40% and improving stability by 60%",
        "Led documentation, mentoring, and training sessions, boosting team efficiency by 25%",
        "Reduced onboarding time by 50% through comprehensive documentation",
        "Built custom React + TypeScript component library; integrated with backend APIs and coordinated on data contracts and error handling"
      ],
      technologies: ["React.js", "TypeScript", "JavaScript", "Material UI", "SCSS", "REST APIs"]
    }
  ],
  
  projects: [
    {
      "title": "3D Solar System Explorer",
      "description": "Interactive 3D solar system simulation with realistic physics, PWA capabilities, and immersive educational experience. Features real-time planetary orbits, advanced controls, and offline functionality.",
      "features": [
        "Real-time 3D planetary orbit simulation with physics",
        "Interactive camera controls and planet selection",
        "Progressive Web App with offline functionality",
        "Advanced star field with customizable effects",
        "Material-UI control panels with real-time adjustments",
        "Service worker caching for optimal performance",
        "Responsive design for desktop and mobile devices",
        "Educational planet information panels"
      ],
      "category": "3D Graphics/WebGL",
      "status": "Live",
      "technologies": [
        "React",
        "Next.js", 
        "TypeScript",
        "Three.js",
        "React Three Fiber",
        "Material-UI",
        "PWA",
        "Service Workers",
        "WebGL",
        "Framer Motion"
      ],
      "demoUrl": "https://react-galaxy.vercel.app/",
      "codeUrl": "https://github.com/Shubham-Printe/React-Galaxy"
    },
    {
      "title": "Smart PDF Document Analyzer",
      "description": "Full-stack document processing platform with intelligent NLP categorization, hybrid extraction system, and enterprise-grade analytics. Evolved from external API dependencies to cost-effective local processing.",
      "features": [
        "Hybrid PDF processing with 99%+ reliability (PDF.co + fallback)",
        "Local NLP-powered document categorization and entity extraction",
        "Advanced analytics dashboard with real-time MongoDB insights",
        "Enterprise custom branding and white-label capabilities",
        "Comprehensive document management with search and filtering",
        "Cost-optimized architecture (zero per-request processing fees)",
        "Production-ready deployment with security hardening"
      ],
      "category": "Full-Stack Application",
      "status": "Live",
      "technologies": [
        "Next.js 15",
        "TypeScript",
        "Material-UI v7",
        "MongoDB Atlas",
        "PDF.co API",
        "Compromise.js",
        "Recharts",
      ],
      "demoUrl": "https://smart-analyser-steel.vercel.app/",
      "codeUrl": "https://github.com/Shubham-Printe/smart-analyser"
    },
    {
      "title": "NoteHive - Offline-First PWA",
      "description": "A modern Progressive Web App for managing markdown notes with offline-first architecture, featuring IndexedDB storage, background sync, and intelligent search capabilities.",
      "features": [
        "Offline-first architecture with IndexedDB storage",
        "Progressive Web App (PWA) with service worker caching",
        "Real-time markdown editor with live preview",
        "Intelligent search with tag filtering and relevance scoring",
        "Background synchronization when online",
        "Tag-based note organization and management",
        "Responsive Material UI design with Apple-inspired aesthetics",
        "App shell architecture for instant loading"
      ],
      "category": "Web Development",
      "status": "Beta",
      "technologies": [
        "Next.js 15",
        "React",
        "TypeScript", 
        "Material UI",
        "IndexedDB",
        "Service Workers",
        "Workbox",
        "PWA",
        "React Markdown"
      ],
      "demoUrl": "https://note-hive-mu.vercel.app/",
      "codeUrl": "https://github.com/Shubham-Printe/NoteHive"
    },
    {
      "title": "Personal Data Analytics Dashboard",
      "description": "Interactive data visualization platform that transforms personal lifestyle data into actionable insights through advanced charting and predictive analytics.",
      "features": [
        "Weather-mood correlation analysis with multiple chart types",
        "Interactive scatter plots and time series visualizations", 
        "Predictive insights with machine learning-based forecasting",
        "Real-time pattern recognition and trend analysis",
        "Responsive design with modern UI/UX",
        "Multi-dimensional data correlation (temperature, humidity, mood, energy)",
        "Advanced filtering and timeframe selection",
        "Key insights extraction and recommendations"
      ],
      "category": "Data Visualization",
      "status": "In Development",
      "technologies": [
        "React",
        "Next.js 15",
        "TypeScript", 
        "Recharts",
        "Tailwind CSS",
        "React Hooks",
        "Responsive Design"
      ],
      "demoUrl": "https://data-viz-mocha.vercel.app/",
      "codeUrl": "https://github.com/Shubham-Printe/DataViz"
    },
    {
      "title": "Netflix Clone - Professional Streaming Platform",
      "description": "A fully-featured Netflix clone built with React 18 and Material-UI, featuring complete user authentication, TMDB API integration, advanced search capabilities, and a professional streaming interface with trailer playback functionality.",
      "features": [
        "Complete user authentication system with protected routes",
        "TMDB API integration with comprehensive error handling and retry logic",
        "Advanced search with multi-type filtering, sorting, and pagination",
        "Professional list/grid view toggles with Netflix-style design",
        "YouTube trailer integration with modal playbook",
        "Multi-user profile management system",
        "Interactive notifications system with real-time updates",
        "Responsive Material-UI design with Netflix-inspired dark theme",
        "Watchlist and watch history tracking",
        "Comprehensive settings and user preference management",
        "Professional error boundaries and loading states",
        "Production-ready build with optimized performance"
      ],
      "category": "Web Development",
      "status": "Live",
      "technologies": [
        "React 18",
        "Material-UI v7",
        "React Router v6",
        "Axios",
        "TMDB API",
        "Context API",
        "Local Storage",
        "SCSS",
      ],
      "demoUrl": "https://netflix-clone-swart-omega.vercel.app/",
      "codeUrl": "https://github.com/Shubham-Printe/Netflix_Clone"
    }
  ],
  
  about: {
    sectionTitle: "Building Digital Excellence",
    description1: "Full-stack engineer with 4+ years building production web applications (React, TypeScript) and 2–3 years hands-on backend development (Node.js, REST APIs). I focus on API design, integration patterns, and cross-team coordination—owning features end-to-end from API to UI, with a strong emphasis on performance optimization and maintainable, enterprise-grade code.",
    description2: "I believe in clean architecture, team collaboration, and continuous learning. I bring discipline and ownership to every project—mentoring developers, driving technical design and code reviews, and aligning delivery with stakeholder and release practices.",
    interestsTitle: "What Drives Me",
    interests: [
      "API Design & Integration",
      "Performance Optimization",
      "Team Leadership & Mentoring",
      "End-to-End Ownership"
    ]
  },
  
  branding: {
    primaryColors: ["#8B5CF6", "#EC4899", "#06B6D4", "#3B82F6", "#10B981"],
    particleColors: [
      "rgba(139, 92, 246, 0.6)",
      "rgba(236, 72, 153, 0.6)",
      "rgba(59, 130, 246, 0.6)",
      "rgba(6, 182, 212, 0.6)",
      "rgba(34, 197, 94, 0.6)"
    ],
    logoText: "SP",
    gradients: {
      hero: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #06B6D4 100%)",
      about: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
      experience: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
      skills: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
      projects: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
      contact: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)"
    }
  },
  
  config: {
    showParticles: true,
    particleCount: 15,
    defaultTheme: "dark",
    defaultLanguage: "en",
    sections: {
      hero: true,
      about: true,
      experience: true,
      skills: true,
      projects: true,
      contact: true
    }
  }
};

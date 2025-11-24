import { create } from 'zustand';
import { ResumeData } from '@/types/resume';

interface ResumeState {
  resumeData: ResumeData;
  isLoading: boolean;
  setResumeData: (data: ResumeData) => void;
  
  // Meta
  setTemplateId: (id: string) => void;

  // Basics
  updateBasics: (basics: Partial<ResumeData['basics']>) => void;
  
  // Work
  addWork: () => void;
  updateWork: (index: number, work: Partial<ResumeData['work'][0]>) => void;
  removeWork: (index: number) => void;

  // Education
  addEducation: () => void;
  updateEducation: (index: number, education: Partial<ResumeData['education'][0]>) => void;
  removeEducation: (index: number) => void;

  // Skills
  addSkill: () => void;
  updateSkill: (index: number, skill: Partial<ResumeData['skills'][0]>) => void;
  removeSkill: (index: number) => void;

  // Projects
  addProject: () => void;
  updateProject: (index: number, project: Partial<ResumeData['projects'][0]>) => void;
  removeProject: (index: number) => void;
}

const initialResumeData: ResumeData = {
  basics: {
    name: "Your Name",
    label: "Professional Title",
    email: "email@example.com",
    phone: "",
    url: "",
    summary: "",
    location: {
      address: "",
      postalCode: "",
      city: "",
      countryCode: "",
      region: "",
    },
    profiles: [],
  },
  work: [],
  education: [],
  skills: [],
  projects: [],
  languages: [],
  meta: {
    templateId: "standard",
    themeColor: "#000000",
    lastModified: Date.now(),
  },
};

export const useResumeStore = create<ResumeState>((set) => ({
  resumeData: initialResumeData,
  isLoading: false,
  setResumeData: (data) => set({ resumeData: data }),
  
  setTemplateId: (id) => 
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        meta: { ...state.resumeData.meta, templateId: id }
      }
    })),

  updateBasics: (basics) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        basics: { ...state.resumeData.basics, ...basics },
      },
    })),

  // Work
  addWork: () =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        work: [
          ...state.resumeData.work,
          {
            id: crypto.randomUUID(),
            name: "",
            position: "",
            url: "",
            startDate: "",
            endDate: "",
            summary: "",
            highlights: [],
          },
        ],
      },
    })),
  updateWork: (index, work) =>
    set((state) => {
      const newItems = [...state.resumeData.work];
      newItems[index] = { ...newItems[index], ...work };
      return {
        resumeData: { ...state.resumeData, work: newItems },
      };
    }),
  removeWork: (index) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        work: state.resumeData.work.filter((_, i) => i !== index),
      },
    })),

  // Education
  addEducation: () =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        education: [
          ...state.resumeData.education,
          {
            id: crypto.randomUUID(),
            institution: "",
            url: "",
            area: "",
            studyType: "",
            startDate: "",
            endDate: "",
            score: "",
            courses: [],
          },
        ],
      },
    })),
  updateEducation: (index, education) =>
    set((state) => {
      const newItems = [...state.resumeData.education];
      newItems[index] = { ...newItems[index], ...education };
      return {
        resumeData: { ...state.resumeData, education: newItems },
      };
    }),
  removeEducation: (index) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        education: state.resumeData.education.filter((_, i) => i !== index),
      },
    })),

  // Skills
  addSkill: () =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        skills: [
          ...state.resumeData.skills,
          {
            id: crypto.randomUUID(),
            name: "",
            level: "Intermediate",
            keywords: [],
          },
        ],
      },
    })),
  updateSkill: (index, skill) =>
    set((state) => {
      const newItems = [...state.resumeData.skills];
      newItems[index] = { ...newItems[index], ...skill };
      return {
        resumeData: { ...state.resumeData, skills: newItems },
      };
    }),
  removeSkill: (index) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        skills: state.resumeData.skills.filter((_, i) => i !== index),
      },
    })),

  // Projects
  addProject: () =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: [
          ...state.resumeData.projects,
          {
            id: crypto.randomUUID(),
            name: "",
            description: "",
            highlights: [],
            keywords: [],
            startDate: "",
            endDate: "",
            url: "",
            roles: [],
          },
        ],
      },
    })),
  updateProject: (index, project) =>
    set((state) => {
      const newItems = [...state.resumeData.projects];
      newItems[index] = { ...newItems[index], ...project };
      return {
        resumeData: { ...state.resumeData, projects: newItems },
      };
    }),
  removeProject: (index) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: state.resumeData.projects.filter((_, i) => i !== index),
      },
    })),
}));

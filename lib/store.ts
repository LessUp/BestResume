import { create } from 'zustand';
import { ResumeData } from '@/types/resume';

interface ResumeState {
  resumeData: ResumeData;
  isLoading: boolean;
  setResumeData: (data: ResumeData) => void;
  
  // Meta
  setTemplateId: (id: string) => void;
  updateMeta: (meta: Partial<ResumeData['meta']>) => void;

  // Basics
  updateBasics: (basics: Partial<ResumeData['basics']>) => void;
  updateBasicsLocation: (location: Partial<ResumeData['basics']['location']>) => void;
  addProfile: () => void;
  updateProfile: (index: number, profile: Partial<ResumeData['basics']['profiles'][0]>) => void;
  removeProfile: (index: number) => void;

  // Languages
  addLanguage: () => void;
  updateLanguage: (index: number, language: Partial<ResumeData['languages'][0]>) => void;
  removeLanguage: (index: number) => void;
  
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

const normalizeResumeData = (data: ResumeData): ResumeData => {
  const basics = (data as any)?.basics ?? {};
  const location = basics.location ?? {};

  return {
    basics: {
      name: basics.name ?? initialResumeData.basics.name,
      label: basics.label ?? initialResumeData.basics.label,
      email: basics.email ?? initialResumeData.basics.email,
      phone: basics.phone ?? initialResumeData.basics.phone,
      url: basics.url ?? initialResumeData.basics.url,
      summary: basics.summary ?? initialResumeData.basics.summary,
      location: {
        address: location.address ?? initialResumeData.basics.location.address,
        postalCode: location.postalCode ?? initialResumeData.basics.location.postalCode,
        city: location.city ?? initialResumeData.basics.location.city,
        countryCode: location.countryCode ?? initialResumeData.basics.location.countryCode,
        region: location.region ?? initialResumeData.basics.location.region,
      },
      profiles: Array.isArray(basics.profiles)
        ? basics.profiles.map((p: any) => ({
            network: p?.network ?? "",
            username: p?.username ?? "",
            url: p?.url ?? "",
          }))
        : [],
    },
    work: Array.isArray((data as any)?.work)
      ? (data as any).work.map((job: any) => ({
          id: job?.id ?? crypto.randomUUID(),
          name: job?.name ?? "",
          position: job?.position ?? "",
          url: job?.url ?? "",
          startDate: job?.startDate ?? "",
          endDate: job?.endDate ?? "",
          summary: job?.summary ?? "",
          highlights: Array.isArray(job?.highlights) ? job.highlights : [],
        }))
      : [],
    education: Array.isArray((data as any)?.education)
      ? (data as any).education.map((edu: any) => ({
          id: edu?.id ?? crypto.randomUUID(),
          institution: edu?.institution ?? "",
          url: edu?.url ?? "",
          area: edu?.area ?? "",
          studyType: edu?.studyType ?? "",
          startDate: edu?.startDate ?? "",
          endDate: edu?.endDate ?? "",
          score: edu?.score ?? "",
          courses: Array.isArray(edu?.courses) ? edu.courses : [],
        }))
      : [],
    skills: Array.isArray((data as any)?.skills)
      ? (data as any).skills.map((skill: any) => ({
          id: skill?.id ?? crypto.randomUUID(),
          name: skill?.name ?? "",
          level: skill?.level ?? "Intermediate",
          keywords: Array.isArray(skill?.keywords) ? skill.keywords : [],
        }))
      : [],
    projects: Array.isArray((data as any)?.projects)
      ? (data as any).projects.map((project: any) => ({
          id: project?.id ?? crypto.randomUUID(),
          name: project?.name ?? "",
          description: project?.description ?? "",
          highlights: Array.isArray(project?.highlights) ? project.highlights : [],
          keywords: Array.isArray(project?.keywords) ? project.keywords : [],
          startDate: project?.startDate ?? "",
          endDate: project?.endDate ?? "",
          url: project?.url ?? "",
          roles: Array.isArray(project?.roles) ? project.roles : [],
        }))
      : [],
    languages: Array.isArray((data as any)?.languages)
      ? (data as any).languages.map((language: any) => ({
          id: language?.id ?? crypto.randomUUID(),
          language: language?.language ?? "",
          fluency: language?.fluency ?? "",
        }))
      : [],
    meta: {
      templateId: (data as any)?.meta?.templateId ?? initialResumeData.meta.templateId,
      themeColor: (data as any)?.meta?.themeColor ?? initialResumeData.meta.themeColor,
      lastModified:
        typeof (data as any)?.meta?.lastModified === 'number'
          ? (data as any).meta.lastModified
          : Date.now(),
      versionName: (data as any)?.meta?.versionName,
    },
  };
};

export const useResumeStore = create<ResumeState>((set) => ({
  resumeData: initialResumeData,
  isLoading: false,
  setResumeData: (data) => set({ resumeData: normalizeResumeData(data) }),
  
  setTemplateId: (id) => 
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        meta: { ...state.resumeData.meta, templateId: id, lastModified: Date.now() }
      }
    })),

  updateMeta: (meta) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        meta: { ...state.resumeData.meta, ...meta, lastModified: Date.now() },
      },
    })),

  updateBasics: (basics) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        basics: {
          ...state.resumeData.basics,
          ...basics,
          location: {
            ...state.resumeData.basics.location,
            ...(basics.location ?? {}),
          },
        },
        meta: { ...state.resumeData.meta, lastModified: Date.now() },
      },
    })),

  updateBasicsLocation: (location) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        basics: {
          ...state.resumeData.basics,
          location: { ...state.resumeData.basics.location, ...location },
        },
        meta: { ...state.resumeData.meta, lastModified: Date.now() },
      },
    })),

  addProfile: () =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        basics: {
          ...state.resumeData.basics,
          profiles: [
            ...state.resumeData.basics.profiles,
            {
              network: "",
              username: "",
              url: "",
            },
          ],
        },
        meta: { ...state.resumeData.meta, lastModified: Date.now() },
      },
    })),

  updateProfile: (index, profile) =>
    set((state) => {
      const newItems = [...state.resumeData.basics.profiles];
      newItems[index] = { ...newItems[index], ...profile };
      return {
        resumeData: {
          ...state.resumeData,
          basics: { ...state.resumeData.basics, profiles: newItems },
          meta: { ...state.resumeData.meta, lastModified: Date.now() },
        },
      };
    }),

  removeProfile: (index) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        basics: {
          ...state.resumeData.basics,
          profiles: state.resumeData.basics.profiles.filter((_, i) => i !== index),
        },
        meta: { ...state.resumeData.meta, lastModified: Date.now() },
      },
    })),

  addLanguage: () =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        languages: [
          ...state.resumeData.languages,
          {
            id: crypto.randomUUID(),
            language: "",
            fluency: "",
          },
        ],
        meta: { ...state.resumeData.meta, lastModified: Date.now() },
      },
    })),

  updateLanguage: (index, language) =>
    set((state) => {
      const newItems = [...state.resumeData.languages];
      newItems[index] = { ...newItems[index], ...language };
      return {
        resumeData: {
          ...state.resumeData,
          languages: newItems,
          meta: { ...state.resumeData.meta, lastModified: Date.now() },
        },
      };
    }),

  removeLanguage: (index) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        languages: state.resumeData.languages.filter((_, i) => i !== index),
        meta: { ...state.resumeData.meta, lastModified: Date.now() },
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
        meta: { ...state.resumeData.meta, lastModified: Date.now() },
      },
    })),
  updateWork: (index, work) =>
    set((state) => {
      const newItems = [...state.resumeData.work];
      newItems[index] = { ...newItems[index], ...work };
      return {
        resumeData: {
          ...state.resumeData,
          work: newItems,
          meta: { ...state.resumeData.meta, lastModified: Date.now() },
        },
      };
    }),
  removeWork: (index) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        work: state.resumeData.work.filter((_, i) => i !== index),
        meta: { ...state.resumeData.meta, lastModified: Date.now() },
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
        meta: { ...state.resumeData.meta, lastModified: Date.now() },
      },
    })),
  updateEducation: (index, education) =>
    set((state) => {
      const newItems = [...state.resumeData.education];
      newItems[index] = { ...newItems[index], ...education };
      return {
        resumeData: {
          ...state.resumeData,
          education: newItems,
          meta: { ...state.resumeData.meta, lastModified: Date.now() },
        },
      };
    }),
  removeEducation: (index) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        education: state.resumeData.education.filter((_, i) => i !== index),
        meta: { ...state.resumeData.meta, lastModified: Date.now() },
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
        meta: { ...state.resumeData.meta, lastModified: Date.now() },
      },
    })),
  updateSkill: (index, skill) =>
    set((state) => {
      const newItems = [...state.resumeData.skills];
      newItems[index] = { ...newItems[index], ...skill };
      return {
        resumeData: {
          ...state.resumeData,
          skills: newItems,
          meta: { ...state.resumeData.meta, lastModified: Date.now() },
        },
      };
    }),
  removeSkill: (index) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        skills: state.resumeData.skills.filter((_, i) => i !== index),
        meta: { ...state.resumeData.meta, lastModified: Date.now() },
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
        meta: { ...state.resumeData.meta, lastModified: Date.now() },
      },
    })),
  updateProject: (index, project) =>
    set((state) => {
      const newItems = [...state.resumeData.projects];
      newItems[index] = { ...newItems[index], ...project };
      return {
        resumeData: {
          ...state.resumeData,
          projects: newItems,
          meta: { ...state.resumeData.meta, lastModified: Date.now() },
        },
      };
    }),
  removeProject: (index) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: state.resumeData.projects.filter((_, i) => i !== index),
        meta: { ...state.resumeData.meta, lastModified: Date.now() },
      },
    })),
}));

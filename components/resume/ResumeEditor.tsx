import React, { useState, useEffect } from 'react';
import { useResumeStore } from '@/lib/store';
import { ResumeData } from '@/types/resume';
import { useTranslations } from 'next-intl';
import { BasicsForm } from './forms/BasicsForm';
import { WorkForm } from './forms/WorkForm';
import { EducationForm } from './forms/EducationForm';
import { SkillsForm } from './forms/SkillsForm';
import { ProjectsForm } from './forms/ProjectsForm';
import { LanguagesForm } from './forms/LanguagesForm';
import { TemplateSelector } from './forms/TemplateSelector';
import { ResumePreview } from './ResumePreview';
import { Button } from '@/components/ui/button';
import { User, Briefcase, GraduationCap, Layers, FolderGit2, LayoutTemplate, Globe } from 'lucide-react';

interface ResumeEditorProps {
  initialData?: ResumeData;
  mobilePreviewOpen?: boolean;
  initialTemplateId?: string;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ initialData, mobilePreviewOpen = false, initialTemplateId }) => {
  const [activeSection, setActiveSection] = useState('basics'); // Default to basics
  const { setResumeData, setTemplateId } = useResumeStore();
  const t = useTranslations('Editor');

  useEffect(() => {
    if (initialData) {
      setResumeData(initialData);
    } else if (initialTemplateId) {
      setTemplateId(initialTemplateId);
    }
  }, [initialData, initialTemplateId, setResumeData, setTemplateId]);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] gap-0 bg-background overflow-hidden">
      {/* Sidebar Navigation - Studio Style */}
      <aside className={`w-full lg:w-72 flex-shrink-0 border-r border-border/50 bg-muted/20 backdrop-blur-xl print:hidden ${mobilePreviewOpen ? 'hidden lg:block' : 'block'}`}>
        <div className="flex flex-col h-full p-6 space-y-8">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-3">{t('sidebarDesign')}</h3>
            <div className="space-y-1">
              <Button
                variant={activeSection === 'templates' ? 'secondary' : 'ghost'}
                className={`w-full justify-between h-11 px-3 rounded-xl transition-all duration-300 ${activeSection === 'templates' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-bold' : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'}`}
                onClick={() => setActiveSection('templates')}
              >
                <div className="flex items-center">
                  <LayoutTemplate className={`mr-3 h-4 w-4 ${activeSection === 'templates' ? 'animate-pulse' : ''}`} />
                  {t('sidebarTemplates')}
                </div>
                {activeSection === 'templates' && <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-3">{t('sidebarContent')}</h3>
            <div className="space-y-1.5">
              {[
                { id: 'basics', icon: User, label: t('sectionPersonal') },
                { id: 'work', icon: Briefcase, label: t('sectionExperience') },
                { id: 'education', icon: GraduationCap, label: t('sectionEducation') },
                { id: 'skills', icon: Layers, label: t('sectionSkills') },
                { id: 'languages', icon: Globe, label: t('sectionLanguages') },
                { id: 'projects', icon: FolderGit2, label: t('sectionProjects') },
              ].map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? 'secondary' : 'ghost'}
                  className={`w-full justify-between h-11 px-3 rounded-xl transition-all duration-300 ${activeSection === item.id ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 font-bold' : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </div>
                  {activeSection === item.id && <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
                </Button>
              ))}
            </div>
          </div>

          {/* Studio Info / Tips */}
          <div className="mt-auto p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <p className="text-[11px] text-primary font-bold leading-relaxed">
              Pro Tip: Keep your bullet points concise and result-oriented.
            </p>
          </div>
        </div>
      </aside>

      {/* Form Area - Focused Workspace */}
      <div className={`flex-1 overflow-y-auto bg-background print:hidden ${mobilePreviewOpen ? 'hidden xl:block' : 'block'}`}>
        <div className="max-w-3xl mx-auto px-8 py-12 pb-32">
          <div className="mb-10 flex items-center gap-3">
            <div className="h-10 w-1 bg-primary rounded-full" />
            <h2 className="text-3xl font-black tracking-tighter text-foreground">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h2>
          </div>

          <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 p-8 shadow-sm">
            {activeSection === 'templates' && <TemplateSelector />}
            {activeSection === 'basics' && <BasicsForm />}
            {activeSection === 'work' && <WorkForm />}
            {activeSection === 'education' && <EducationForm />}
            {activeSection === 'skills' && <SkillsForm />}
            {activeSection === 'languages' && <LanguagesForm />}
            {activeSection === 'projects' && <ProjectsForm />}
          </div>
        </div>
      </div>

      {/* Preview Area - Realistic Mockup */}
      <div className={`flex-1 bg-muted/40 border-l border-border/50 overflow-hidden relative print:block print:bg-white print:border-none print:overflow-visible ${mobilePreviewOpen ? 'block' : 'hidden xl:block'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary),transparent_100%)] opacity-[0.03] pointer-events-none" />
        <ResumePreview />
      </div>
    </div>
  );
};

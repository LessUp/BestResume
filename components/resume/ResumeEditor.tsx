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
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] gap-6 p-6 bg-muted/30">
       {/* Sidebar Navigation */}
       <aside className={`w-full lg:w-64 flex-shrink-0 print:hidden ${mobilePreviewOpen ? 'hidden lg:block' : 'block'}`}>
         <div className="bg-card rounded-lg border border-border shadow-sm p-4 space-y-1 sticky top-4">
            <h3 className="font-semibold text-muted-foreground text-xs uppercase mb-3 px-2 tracking-wider">{t('sidebarDesign')}</h3>
            <Button 
              variant={activeSection === 'templates' ? 'secondary' : 'ghost'} 
              className={`w-full justify-start ${activeSection === 'templates' ? 'bg-secondary text-secondary-foreground font-medium' : 'text-muted-foreground'}`}
              onClick={() => setActiveSection('templates')}
            >
              <LayoutTemplate className="mr-2 h-4 w-4" /> {t('sidebarTemplates')}
            </Button>

            <div className="h-4"></div> {/* Spacer */}

            <h3 className="font-semibold text-muted-foreground text-xs uppercase mb-3 px-2 tracking-wider">{t('sidebarContent')}</h3>
            <Button 
              variant={activeSection === 'basics' ? 'secondary' : 'ghost'} 
              className={`w-full justify-start ${activeSection === 'basics' ? 'bg-secondary text-secondary-foreground font-medium' : 'text-muted-foreground'}`}
              onClick={() => setActiveSection('basics')}
            >
              <User className="mr-2 h-4 w-4" /> {t('sectionPersonal')}
            </Button>
            <Button 
              variant={activeSection === 'work' ? 'secondary' : 'ghost'} 
              className={`w-full justify-start ${activeSection === 'work' ? 'bg-secondary text-secondary-foreground font-medium' : 'text-muted-foreground'}`}
              onClick={() => setActiveSection('work')}
            >
              <Briefcase className="mr-2 h-4 w-4" /> {t('sectionExperience')}
            </Button>
            <Button 
              variant={activeSection === 'education' ? 'secondary' : 'ghost'} 
              className={`w-full justify-start ${activeSection === 'education' ? 'bg-secondary text-secondary-foreground font-medium' : 'text-muted-foreground'}`}
              onClick={() => setActiveSection('education')}
            >
              <GraduationCap className="mr-2 h-4 w-4" /> {t('sectionEducation')}
            </Button>
            <Button 
              variant={activeSection === 'skills' ? 'secondary' : 'ghost'} 
              className={`w-full justify-start ${activeSection === 'skills' ? 'bg-secondary text-secondary-foreground font-medium' : 'text-muted-foreground'}`}
              onClick={() => setActiveSection('skills')}
            >
              <Layers className="mr-2 h-4 w-4" /> {t('sectionSkills')}
            </Button>
            <Button 
              variant={activeSection === 'languages' ? 'secondary' : 'ghost'} 
              className={`w-full justify-start ${activeSection === 'languages' ? 'bg-secondary text-secondary-foreground font-medium' : 'text-muted-foreground'}`}
              onClick={() => setActiveSection('languages')}
            >
              <Globe className="mr-2 h-4 w-4" /> {t('sectionLanguages')}
            </Button>
            <Button 
              variant={activeSection === 'projects' ? 'secondary' : 'ghost'} 
              className={`w-full justify-start ${activeSection === 'projects' ? 'bg-secondary text-secondary-foreground font-medium' : 'text-muted-foreground'}`}
              onClick={() => setActiveSection('projects')}
            >
              <FolderGit2 className="mr-2 h-4 w-4" /> {t('sectionProjects')}
            </Button>
         </div>
       </aside>

       {/* Form Area */}
       <div className={`flex-1 max-w-2xl overflow-y-auto pb-20 print:hidden ${mobilePreviewOpen ? 'hidden xl:block' : 'block'}`}>
          {activeSection === 'templates' && <TemplateSelector />}
          {activeSection === 'basics' && <BasicsForm />}
          {activeSection === 'work' && <WorkForm />}
          {activeSection === 'education' && <EducationForm />}
          {activeSection === 'skills' && <SkillsForm />}
          {activeSection === 'languages' && <LanguagesForm />}
          {activeSection === 'projects' && <ProjectsForm />}
       </div>

       {/* Preview Area */}
       <div className={`flex-1 bg-muted/50 border-l border-border overflow-hidden relative print:block print:bg-white print:border-none print:overflow-visible ${mobilePreviewOpen ? 'block' : 'hidden xl:block'}`}>
          <ResumePreview />
       </div>
    </div>
  );
};

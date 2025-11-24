import React, { useState, useEffect } from 'react';
import { useResumeStore } from '@/lib/store';
import { ResumeData } from '@/types/resume';
import { BasicsForm } from './forms/BasicsForm';
import { WorkForm } from './forms/WorkForm';
import { EducationForm } from './forms/EducationForm';
import { SkillsForm } from './forms/SkillsForm';
import { ProjectsForm } from './forms/ProjectsForm';
import { TemplateSelector } from './forms/TemplateSelector';
import { ResumePreview } from './ResumePreview';
import { Button } from '@/components/ui/button';
import { User, Briefcase, GraduationCap, Layers, FolderGit2, LayoutTemplate } from 'lucide-react';

interface ResumeEditorProps {
  initialData?: ResumeData;
  mobilePreviewOpen?: boolean;
  initialTemplateId?: string;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ initialData, mobilePreviewOpen = false, initialTemplateId }) => {
  const [activeSection, setActiveSection] = useState('basics'); // Default to basics
  const { setResumeData, setTemplateId } = useResumeStore();

  useEffect(() => {
    if (initialData) {
      setResumeData(initialData);
    } else if (initialTemplateId) {
      setTemplateId(initialTemplateId);
    }
  }, [initialData, initialTemplateId, setResumeData, setTemplateId]);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] gap-6 p-6 bg-gray-50">
       {/* Sidebar Navigation */}
       <aside className={`w-full lg:w-64 flex-shrink-0 print:hidden ${mobilePreviewOpen ? 'hidden lg:block' : 'block'}`}>
         <div className="bg-white rounded-lg shadow-sm p-4 space-y-2 sticky top-4">
            <h3 className="font-semibold text-gray-500 text-sm uppercase mb-4 px-2">Design</h3>
            <Button 
              variant={activeSection === 'templates' ? 'default' : 'ghost'} 
              className="w-full justify-start" 
              onClick={() => setActiveSection('templates')}
            >
              <LayoutTemplate className="mr-2 h-4 w-4" /> Templates
            </Button>

            <div className="h-4"></div> {/* Spacer */}

            <h3 className="font-semibold text-gray-500 text-sm uppercase mb-4 px-2">Content</h3>
            <Button 
              variant={activeSection === 'basics' ? 'default' : 'ghost'} 
              className="w-full justify-start" 
              onClick={() => setActiveSection('basics')}
            >
              <User className="mr-2 h-4 w-4" /> Personal
            </Button>
            <Button 
              variant={activeSection === 'work' ? 'default' : 'ghost'} 
              className="w-full justify-start" 
              onClick={() => setActiveSection('work')}
            >
              <Briefcase className="mr-2 h-4 w-4" /> Experience
            </Button>
            <Button 
              variant={activeSection === 'education' ? 'default' : 'ghost'} 
              className="w-full justify-start" 
              onClick={() => setActiveSection('education')}
            >
              <GraduationCap className="mr-2 h-4 w-4" /> Education
            </Button>
            <Button 
              variant={activeSection === 'skills' ? 'default' : 'ghost'} 
              className="w-full justify-start" 
              onClick={() => setActiveSection('skills')}
            >
              <Layers className="mr-2 h-4 w-4" /> Skills
            </Button>
            <Button 
              variant={activeSection === 'projects' ? 'default' : 'ghost'} 
              className="w-full justify-start" 
              onClick={() => setActiveSection('projects')}
            >
              <FolderGit2 className="mr-2 h-4 w-4" /> Projects
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
          {activeSection === 'projects' && <ProjectsForm />}
       </div>

       {/* Preview Area */}
       <div className={`flex-1 bg-gray-200/50 rounded-xl border overflow-hidden relative print:block print:bg-white print:border-none print:overflow-visible ${mobilePreviewOpen ? 'block' : 'hidden xl:block'}`}>
          <div className="absolute inset-0 overflow-y-auto p-8 print:relative print:p-0 print:inset-auto">
             <div className="print:scale-100 origin-top">
              <ResumePreview />
            </div>
          </div>
       </div>
    </div>
  );
};

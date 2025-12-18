import React, { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { ResumeData } from '@/types/resume';
import { useTranslations } from 'next-intl';

interface ProjectItemProps {
  project: ResumeData['projects'][0];
  index: number;
  updateProject: (index: number, project: Partial<ResumeData['projects'][0]>) => void;
  removeProject: (index: number) => void;
}

const ProjectItem = ({ project, index, updateProject, removeProject }: ProjectItemProps) => {
  const [localProject, setLocalProject] = useState(project);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = useTranslations('Resume.forms');

  useEffect(() => {
    setLocalProject(project);
  }, [project]);

  const handleChange = (field: keyof ResumeData['projects'][0], value: any) => {
    setLocalProject(prev => ({ ...prev, [field]: value }));

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      updateProject(index, { [field]: value });
    }, 500);
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm space-y-4 relative group">
      <Button 
        variant="destructive" 
        size="icon" 
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => removeProject(index)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('projectName')}</Label>
          <Input 
            value={localProject.name} 
            onChange={(e) => handleChange('name', e.target.value)} 
            placeholder={t('projectNamePlaceholder')} 
          />
        </div>
        <div className="space-y-2">
          <Label>{t('projectUrl')}</Label>
          <Input 
            value={localProject.url ?? ''} 
            onChange={(e) => handleChange('url', e.target.value)} 
            placeholder={t('projectUrlPlaceholder')} 
          />
        </div>
        <div className="space-y-2">
          <Label>{t('startDate')}</Label>
          <Input 
            value={localProject.startDate} 
            onChange={(e) => handleChange('startDate', e.target.value)} 
            placeholder={t('startDatePlaceholder')} 
          />
        </div>
        <div className="space-y-2">
          <Label>{t('endDate')}</Label>
          <Input 
            value={localProject.endDate} 
            onChange={(e) => handleChange('endDate', e.target.value)} 
            placeholder={t('endDatePlaceholder')} 
          />
        </div>
      </div>
      
      <div className="space-y-2">
         <Label>{t('technologies')}</Label>
         <Input 
           value={(localProject.keywords ?? []).join(', ')} 
           onChange={(e) =>
             handleChange(
               'keywords',
               e.target.value
                 .split(',')
                 .map((s) => s.trim())
                 .filter(Boolean)
             )
           }
           placeholder={t('technologiesPlaceholder')} 
         />
      </div>

      <div className="space-y-2">
        <Label>{t('projectRoles')}</Label>
        <Textarea
          value={(localProject.roles ?? []).join('\n')}
          onChange={(e) =>
            handleChange(
              'roles',
              e.target.value
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
          placeholder={t('projectRolesPlaceholder')}
          className="h-20"
        />
      </div>

      <div className="space-y-2">
        <Label>{t('projectDescription')}</Label>
        <Textarea 
          value={localProject.description} 
          onChange={(e) => handleChange('description', e.target.value)} 
          placeholder={t('projectDescriptionPlaceholder')} 
          className="h-24"
        />
      </div>

      <div className="space-y-2">
        <Label>{t('projectHighlights')}</Label>
        <Textarea
          value={(localProject.highlights ?? []).join('\n')}
          onChange={(e) =>
            handleChange(
              'highlights',
              e.target.value
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
          placeholder={t('projectHighlightsPlaceholder')}
          className="h-24"
        />
      </div>
    </div>
  );
};

export const ProjectsForm = () => {
  const t = useTranslations('Resume.forms');
  const projects = useResumeStore((state) => state.resumeData.projects);
  const addProject = useResumeStore((state) => state.addProject);
  const updateProject = useResumeStore((state) => state.updateProject);
  const removeProject = useResumeStore((state) => state.removeProject);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(projects.length);

  useEffect(() => {
    if (projects.length > prevLengthRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevLengthRef.current = projects.length;
  }, [projects.length]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-lg font-semibold">{t('projectsTitle')}</h2>
         <Button onClick={addProject} size="sm" className="gap-2">
           <Plus className="h-4 w-4" /> {t('addProject')}
         </Button>
      </div>

      {projects.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
          {t('emptyProjects')}
        </div>
      )}

      {projects.map((project, index) => (
        <ProjectItem 
          key={project.id} 
          project={project} 
          index={index} 
          updateProject={updateProject} 
          removeProject={removeProject} 
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

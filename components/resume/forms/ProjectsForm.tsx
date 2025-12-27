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
    <div className="p-6 border border-border/50 rounded-[2rem] bg-card/50 backdrop-blur-sm shadow-sm space-y-6 relative group transition-all duration-300 hover:border-primary/30 hover:shadow-md">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-destructive/10 hover:text-destructive rounded-full"
        onClick={() => removeProject(index)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('projectName')}</Label>
          <Input 
            className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
            value={localProject.name} 
            onChange={(e) => handleChange('name', e.target.value)} 
            placeholder={t('projectNamePlaceholder')} 
          />
        </div>
        <div className="space-y-2.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('projectUrl')}</Label>
          <Input 
            className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
            value={localProject.url ?? ''} 
            onChange={(e) => handleChange('url', e.target.value)} 
            placeholder={t('projectUrlPlaceholder')} 
          />
        </div>
        <div className="space-y-2.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('startDate')}</Label>
          <Input 
            className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
            value={localProject.startDate} 
            onChange={(e) => handleChange('startDate', e.target.value)} 
            placeholder={t('startDatePlaceholder')} 
          />
        </div>
        <div className="space-y-2.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('endDate')}</Label>
          <Input 
            className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
            value={localProject.endDate} 
            onChange={(e) => handleChange('endDate', e.target.value)} 
            placeholder={t('endDatePlaceholder')} 
          />
        </div>
      </div>
      
      <div className="space-y-2.5">
         <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('technologies')}</Label>
         <Input 
           className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
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

      <div className="space-y-2.5">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('projectRoles')}</Label>
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
          className="min-h-[80px] rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all resize-none p-4"
        />
      </div>

      <div className="space-y-2.5">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('projectDescription')}</Label>
        <Textarea 
          value={localProject.description} 
          onChange={(e) => handleChange('description', e.target.value)} 
          placeholder={t('projectDescriptionPlaceholder')} 
          className="min-h-[100px] rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all resize-none p-4"
        />
      </div>

      <div className="space-y-2.5">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('projectHighlights')}</Label>
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
          className="min-h-[100px] rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all resize-none p-4"
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
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 bg-primary rounded-full" />
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">{t('projectsTitle')}</h3>
        </div>
        <Button 
          onClick={addProject} 
          size="sm" 
          variant="outline"
          className="gap-2 rounded-full border-primary/20 hover:border-primary/50 hover:bg-primary/5 bg-background transition-all duration-300"
        >
          <Plus className="h-4 w-4" /> {t('addProject')}
        </Button>
      </div>

      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-muted/20 border-2 border-dashed border-border/50 rounded-[2rem] space-y-4">
          <div className="p-4 bg-background rounded-full shadow-sm">
            <Plus className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{t('emptyProjects')}</p>
            <p className="text-xs text-muted-foreground/60">点击上方按钮添加你的项目经历</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {projects.map((project, index) => (
          <ProjectItem 
            key={project.id} 
            project={project} 
            index={index} 
            updateProject={updateProject} 
            removeProject={removeProject} 
          />
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

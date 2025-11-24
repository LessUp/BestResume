import React, { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { ResumeData } from '@/types/resume';

interface ProjectItemProps {
  project: ResumeData['projects'][0];
  index: number;
  updateProject: (index: number, project: Partial<ResumeData['projects'][0]>) => void;
  removeProject: (index: number) => void;
}

const ProjectItem = ({ project, index, updateProject, removeProject }: ProjectItemProps) => {
  const [localProject, setLocalProject] = useState(project);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
          <Label>Project Name</Label>
          <Input 
            value={localProject.name} 
            onChange={(e) => handleChange('name', e.target.value)} 
            placeholder="E-commerce Platform" 
          />
        </div>
        <div className="space-y-2">
          <Label>Project URL</Label>
          <Input 
            value={localProject.url} 
            onChange={(e) => handleChange('url', e.target.value)} 
            placeholder="https://github.com/..." 
          />
        </div>
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input 
            value={localProject.startDate} 
            onChange={(e) => handleChange('startDate', e.target.value)} 
            placeholder="YYYY-MM" 
          />
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <Input 
            value={localProject.endDate} 
            onChange={(e) => handleChange('endDate', e.target.value)} 
            placeholder="YYYY-MM" 
          />
        </div>
      </div>
      
      <div className="space-y-2">
         <Label>Technologies (Comma separated)</Label>
         <Input 
           value={localProject.keywords.join(', ')} 
           onChange={(e) => handleChange('keywords', e.target.value.split(',').map(s => s.trim()))} 
           placeholder="React, Node.js, AWS" 
         />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea 
          value={localProject.description} 
          onChange={(e) => handleChange('description', e.target.value)} 
          placeholder="Describe the project and your role... (e.g. Built a full-stack application using Next.js...)" 
          className="h-24"
        />
      </div>
    </div>
  );
};

export const ProjectsForm = () => {
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
         <h2 className="text-lg font-semibold">Projects</h2>
         <Button onClick={addProject} size="sm" className="gap-2">
           <Plus className="h-4 w-4" /> Add Project
         </Button>
      </div>

      {projects.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
          No projects added yet.
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

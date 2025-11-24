import React, { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { ResumeData } from '@/types/resume';

interface WorkItemProps {
  job: ResumeData['work'][0];
  index: number;
  updateWork: (index: number, work: Partial<ResumeData['work'][0]>) => void;
  removeWork: (index: number) => void;
}

const WorkItem = ({ job, index, updateWork, removeWork }: WorkItemProps) => {
  const [localJob, setLocalJob] = useState(job);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalJob(job);
  }, [job]);

  const handleChange = (field: keyof ResumeData['work'][0], value: any) => {
    setLocalJob(prev => ({ ...prev, [field]: value }));

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      updateWork(index, { [field]: value });
    }, 500);
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm space-y-4 relative group">
      <Button 
        variant="destructive" 
        size="icon" 
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => removeWork(index)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Company Name</Label>
          <Input 
            value={localJob.name} 
            onChange={(e) => handleChange('name', e.target.value)} 
            placeholder="Google" 
          />
        </div>
        <div className="space-y-2">
          <Label>Job Title</Label>
          <Input 
            value={localJob.position} 
            onChange={(e) => handleChange('position', e.target.value)} 
            placeholder="Senior Software Engineer" 
          />
        </div>
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input 
            value={localJob.startDate} 
            onChange={(e) => handleChange('startDate', e.target.value)} 
            placeholder="YYYY-MM" 
          />
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <Input 
            value={localJob.endDate} 
            onChange={(e) => handleChange('endDate', e.target.value)} 
            placeholder="Present / YYYY-MM" 
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Summary</Label>
        <Textarea 
          value={localJob.summary} 
          onChange={(e) => handleChange('summary', e.target.value)} 
          placeholder="Describe your responsibilities and achievements... (e.g. Led a team of 5 developers...)" 
          className="h-24"
        />
      </div>
    </div>
  );
};

export const WorkForm = () => {
  const work = useResumeStore((state) => state.resumeData.work);
  const addWork = useResumeStore((state) => state.addWork);
  const updateWork = useResumeStore((state) => state.updateWork);
  const removeWork = useResumeStore((state) => state.removeWork);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(work.length);

  useEffect(() => {
    if (work.length > prevLengthRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevLengthRef.current = work.length;
  }, [work.length]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-lg font-semibold">Work Experience</h2>
         <Button onClick={addWork} size="sm" className="gap-2">
           <Plus className="h-4 w-4" /> Add Position
         </Button>
      </div>

      {work.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
          No work experience added yet.
        </div>
      )}

      {work.map((job, index) => (
        <WorkItem 
          key={job.id} 
          job={job} 
          index={index} 
          updateWork={updateWork} 
          removeWork={removeWork} 
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

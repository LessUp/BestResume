import React, { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { ResumeData } from '@/types/resume';

interface EducationItemProps {
  edu: ResumeData['education'][0];
  index: number;
  updateEducation: (index: number, education: Partial<ResumeData['education'][0]>) => void;
  removeEducation: (index: number) => void;
}

const EducationItem = ({ edu, index, updateEducation, removeEducation }: EducationItemProps) => {
  const [localEdu, setLocalEdu] = useState(edu);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalEdu(edu);
  }, [edu]);

  const handleChange = (field: keyof ResumeData['education'][0], value: any) => {
    setLocalEdu(prev => ({ ...prev, [field]: value }));

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      updateEducation(index, { [field]: value });
    }, 500);
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm space-y-4 relative group">
      <Button 
        variant="destructive" 
        size="icon" 
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => removeEducation(index)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Institution</Label>
          <Input 
            value={localEdu.institution} 
            onChange={(e) => handleChange('institution', e.target.value)} 
            placeholder="University of Technology" 
          />
        </div>
        <div className="space-y-2">
          <Label>Degree / Study Type</Label>
          <Input 
            value={localEdu.studyType} 
            onChange={(e) => handleChange('studyType', e.target.value)} 
            placeholder="Bachelor's" 
          />
        </div>
        <div className="space-y-2">
          <Label>Area of Study</Label>
          <Input 
            value={localEdu.area} 
            onChange={(e) => handleChange('area', e.target.value)} 
            placeholder="Computer Science" 
          />
        </div>
        <div className="space-y-2">
          <Label>GPA / Score</Label>
          <Input 
            value={localEdu.score} 
            onChange={(e) => handleChange('score', e.target.value)} 
            placeholder="3.8/4.0" 
          />
        </div>
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input 
            value={localEdu.startDate} 
            onChange={(e) => handleChange('startDate', e.target.value)} 
            placeholder="YYYY-MM" 
          />
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <Input 
            value={localEdu.endDate} 
            onChange={(e) => handleChange('endDate', e.target.value)} 
            placeholder="YYYY-MM" 
          />
        </div>
      </div>
    </div>
  );
};

export const EducationForm = () => {
  const education = useResumeStore((state) => state.resumeData.education);
  const addEducation = useResumeStore((state) => state.addEducation);
  const updateEducation = useResumeStore((state) => state.updateEducation);
  const removeEducation = useResumeStore((state) => state.removeEducation);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(education.length);

  useEffect(() => {
    if (education.length > prevLengthRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevLengthRef.current = education.length;
  }, [education.length]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-lg font-semibold">Education</h2>
         <Button onClick={addEducation} size="sm" className="gap-2">
           <Plus className="h-4 w-4" /> Add Education
         </Button>
      </div>

      {education.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
          No education added yet.
        </div>
      )}

      {education.map((edu, index) => (
        <EducationItem 
          key={edu.id} 
          edu={edu} 
          index={index} 
          updateEducation={updateEducation} 
          removeEducation={removeEducation} 
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

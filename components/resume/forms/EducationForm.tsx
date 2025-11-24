import React from 'react';
import { useResumeStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

export const EducationForm = () => {
  const education = useResumeStore((state) => state.resumeData.education);
  const addEducation = useResumeStore((state) => state.addEducation);
  const updateEducation = useResumeStore((state) => state.updateEducation);
  const removeEducation = useResumeStore((state) => state.removeEducation);

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
        <div key={edu.id} className="p-4 border rounded-lg bg-white shadow-sm space-y-4 relative group">
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
                value={edu.institution} 
                onChange={(e) => updateEducation(index, { institution: e.target.value })} 
                placeholder="University of Technology" 
              />
            </div>
            <div className="space-y-2">
              <Label>Degree / Study Type</Label>
              <Input 
                value={edu.studyType} 
                onChange={(e) => updateEducation(index, { studyType: e.target.value })} 
                placeholder="Bachelor's" 
              />
            </div>
            <div className="space-y-2">
              <Label>Area of Study</Label>
              <Input 
                value={edu.area} 
                onChange={(e) => updateEducation(index, { area: e.target.value })} 
                placeholder="Computer Science" 
              />
            </div>
            <div className="space-y-2">
              <Label>GPA / Score</Label>
              <Input 
                value={edu.score} 
                onChange={(e) => updateEducation(index, { score: e.target.value })} 
                placeholder="3.8/4.0" 
              />
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input 
                value={edu.startDate} 
                onChange={(e) => updateEducation(index, { startDate: e.target.value })} 
                placeholder="YYYY-MM" 
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input 
                value={edu.endDate} 
                onChange={(e) => updateEducation(index, { endDate: e.target.value })} 
                placeholder="YYYY-MM" 
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

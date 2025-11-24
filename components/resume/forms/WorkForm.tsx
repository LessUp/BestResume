import React from 'react';
import { useResumeStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

export const WorkForm = () => {
  const { resumeData, addWork, updateWork, removeWork } = useResumeStore();
  const { work } = resumeData;

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
        <div key={job.id} className="p-4 border rounded-lg bg-white shadow-sm space-y-4 relative group">
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
                value={job.name} 
                onChange={(e) => updateWork(index, { name: e.target.value })} 
                placeholder="Google" 
              />
            </div>
            <div className="space-y-2">
              <Label>Job Title</Label>
              <Input 
                value={job.position} 
                onChange={(e) => updateWork(index, { position: e.target.value })} 
                placeholder="Senior Software Engineer" 
              />
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input 
                value={job.startDate} 
                onChange={(e) => updateWork(index, { startDate: e.target.value })} 
                placeholder="YYYY-MM" 
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input 
                value={job.endDate} 
                onChange={(e) => updateWork(index, { endDate: e.target.value })} 
                placeholder="Present / YYYY-MM" 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Summary</Label>
            <Textarea 
              value={job.summary} 
              onChange={(e) => updateWork(index, { summary: e.target.value })} 
              placeholder="Describe your responsibilities and achievements..." 
              className="h-24"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

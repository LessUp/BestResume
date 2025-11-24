import React from 'react';
import { useResumeStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

export const SkillsForm = () => {
  const { resumeData, addSkill, updateSkill, removeSkill } = useResumeStore();
  const { skills } = resumeData;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-lg font-semibold">Skills</h2>
         <Button onClick={addSkill} size="sm" className="gap-2">
           <Plus className="h-4 w-4" /> Add Skill Category
         </Button>
      </div>

      {skills.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
          No skills added yet.
        </div>
      )}

      {skills.map((skill, index) => (
        <div key={skill.id} className="p-4 border rounded-lg bg-white shadow-sm space-y-4 relative group">
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => removeSkill(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Category Name</Label>
              <Input 
                value={skill.name} 
                onChange={(e) => updateSkill(index, { name: e.target.value })} 
                placeholder="Languages / Frameworks / Tools" 
              />
            </div>
            <div className="space-y-2">
              <Label>Skills (Comma separated)</Label>
              <Input 
                value={skill.keywords.join(', ')} 
                onChange={(e) => updateSkill(index, { keywords: e.target.value.split(',').map(s => s.trim()) })} 
                placeholder="React, TypeScript, Node.js" 
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

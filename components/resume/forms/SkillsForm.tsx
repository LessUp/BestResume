import React from 'react';
import { useResumeStore } from '@/lib/store';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

export const SkillsForm = () => {
  const t = useTranslations('Resume.forms');
  const skills = useResumeStore((state) => state.resumeData.skills);
  const addSkill = useResumeStore((state) => state.addSkill);
  const updateSkill = useResumeStore((state) => state.updateSkill);
  const removeSkill = useResumeStore((state) => state.removeSkill);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-lg font-semibold">{t('skillsTitle')}</h2>
         <Button onClick={addSkill} size="sm" className="gap-2">
           <Plus className="h-4 w-4" /> {t('addSkillCategory')}
         </Button>
      </div>

      {skills.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
          {t('emptySkills')}
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
              <Label>{t('skillCategory')}</Label>
              <Input 
                value={skill.name} 
                onChange={(e) => updateSkill(index, { name: e.target.value })} 
                placeholder={t('skillCategoryPlaceholder')} 
              />
            </div>
            <div className="space-y-2">
              <Label>{t('skillKeywords')}</Label>
              <Input 
                value={skill.keywords.join(', ')} 
                onChange={(e) => updateSkill(index, { keywords: e.target.value.split(',').map(s => s.trim()) })} 
                placeholder={t('skillKeywordsPlaceholder')} 
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

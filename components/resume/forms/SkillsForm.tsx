import React from 'react';
import { useResumeStore } from '@/lib/store';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
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
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
          {t('emptySkills')}
        </div>
      )}

      {skills.map((skill, index) => (
        <div key={skill.id} className="p-4 border border-border rounded-lg bg-card shadow-sm space-y-4 relative group">
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => removeSkill(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('skillCategory')}</Label>
                <Input 
                  value={skill.name} 
                  onChange={(e) => updateSkill(index, { name: e.target.value })} 
                  placeholder={t('skillCategoryPlaceholder')} 
                />
              </div>
              <div className="space-y-2">
                <Label>{t('skillLevel')}</Label>
                <Select
                  value={skill.level ?? 'Intermediate'}
                  onValueChange={(value) => updateSkill(index, { level: value })}
                >
                  <SelectTrigger className="mt-1 w-full">
                    {skill.level === 'Beginner'
                      ? t('skillLevelBeginner')
                      : skill.level === 'Advanced'
                        ? t('skillLevelAdvanced')
                        : skill.level === 'Expert'
                          ? t('skillLevelExpert')
                          : t('skillLevelIntermediate')}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">{t('skillLevelBeginner')}</SelectItem>
                    <SelectItem value="Intermediate">{t('skillLevelIntermediate')}</SelectItem>
                    <SelectItem value="Advanced">{t('skillLevelAdvanced')}</SelectItem>
                    <SelectItem value="Expert">{t('skillLevelExpert')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('skillKeywords')}</Label>
              <Input 
                value={(skill.keywords ?? []).join(', ')} 
                onChange={(e) =>
                  updateSkill(index, {
                    keywords: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                placeholder={t('skillKeywordsPlaceholder')} 
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

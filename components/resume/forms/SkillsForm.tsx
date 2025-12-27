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
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 bg-primary rounded-full" />
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">{t('skillsTitle')}</h3>
        </div>
        <Button 
          onClick={addSkill} 
          size="sm" 
          variant="outline"
          className="gap-2 rounded-full border-primary/20 hover:border-primary/50 hover:bg-primary/5 bg-background transition-all duration-300"
        >
          <Plus className="h-4 w-4" /> {t('addSkillCategory')}
        </Button>
      </div>

      {skills.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-muted/20 border-2 border-dashed border-border/50 rounded-[2rem] space-y-4">
          <div className="p-4 bg-background rounded-full shadow-sm">
            <Plus className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{t('emptySkills')}</p>
            <p className="text-xs text-muted-foreground/60">点击上方按钮添加你的技能分类</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {skills.map((skill, index) => (
          <div key={skill.id} className="p-6 border border-border/50 rounded-[2rem] bg-card/50 backdrop-blur-sm shadow-sm space-y-6 relative group transition-all duration-300 hover:border-primary/30 hover:shadow-md">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-destructive/10 hover:text-destructive rounded-full"
              onClick={() => removeSkill(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('skillCategory')}</Label>
                  <Input 
                    className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
                    value={skill.name} 
                    onChange={(e) => updateSkill(index, { name: e.target.value })} 
                    placeholder={t('skillCategoryPlaceholder')} 
                  />
                </div>
                <div className="space-y-2.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('skillLevel')}</Label>
                  <Select
                    value={skill.level ?? 'Intermediate'}
                    onValueChange={(value) => updateSkill(index, { level: value })}
                  >
                    <SelectTrigger className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all">
                      {skill.level === 'Beginner'
                        ? t('skillLevelBeginner')
                        : skill.level === 'Advanced'
                          ? t('skillLevelAdvanced')
                          : skill.level === 'Expert'
                            ? t('skillLevelExpert')
                            : t('skillLevelIntermediate')}
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border/50 shadow-xl backdrop-blur-xl">
                      <SelectItem value="Beginner">{t('skillLevelBeginner')}</SelectItem>
                      <SelectItem value="Intermediate">{t('skillLevelIntermediate')}</SelectItem>
                      <SelectItem value="Advanced">{t('skillLevelAdvanced')}</SelectItem>
                      <SelectItem value="Expert">{t('skillLevelExpert')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('skillKeywords')}</Label>
                <Input 
                  className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
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
    </div>
  );
};

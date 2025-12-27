import React, { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { ResumeData } from '@/types/resume';
import { useTranslations } from 'next-intl';

interface EducationItemProps {
  edu: ResumeData['education'][0];
  index: number;
  updateEducation: (index: number, education: Partial<ResumeData['education'][0]>) => void;
  removeEducation: (index: number) => void;
}

const EducationItem = ({ edu, index, updateEducation, removeEducation }: EducationItemProps) => {
  const [localEdu, setLocalEdu] = useState(edu);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = useTranslations('Resume.forms');

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
    <div className="p-6 border border-border/50 rounded-[2rem] bg-card/50 backdrop-blur-sm shadow-sm space-y-6 relative group transition-all duration-300 hover:border-primary/30 hover:shadow-md">
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-destructive/10 hover:text-destructive rounded-full"
        onClick={() => removeEducation(index)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('institution')}</Label>
          <Input 
            className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
            value={localEdu.institution} 
            onChange={(e) => handleChange('institution', e.target.value)} 
            placeholder={t('institutionPlaceholder')} 
          />
        </div>
        <div className="space-y-2.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('studyType')}</Label>
          <Input 
            className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
            value={localEdu.studyType} 
            onChange={(e) => handleChange('studyType', e.target.value)} 
            placeholder={t('studyTypePlaceholder')} 
          />
        </div>
        <div className="space-y-2.5 md:col-span-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('educationUrl')}</Label>
          <Input
            className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
            value={localEdu.url ?? ''}
            onChange={(e) => handleChange('url', e.target.value)}
            placeholder={t('educationUrlPlaceholder')}
          />
        </div>
        <div className="space-y-2.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('area')}</Label>
          <Input 
            className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
            value={localEdu.area} 
            onChange={(e) => handleChange('area', e.target.value)} 
            placeholder={t('areaPlaceholder')} 
          />
        </div>
        <div className="space-y-2.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('score')}</Label>
          <Input 
            className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
            value={localEdu.score} 
            onChange={(e) => handleChange('score', e.target.value)} 
            placeholder={t('scorePlaceholder')} 
          />
        </div>
        <div className="space-y-2.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('startDate')}</Label>
          <Input 
            className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
            value={localEdu.startDate} 
            onChange={(e) => handleChange('startDate', e.target.value)} 
            placeholder={t('startDatePlaceholder')} 
          />
        </div>
        <div className="space-y-2.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('endDate')}</Label>
          <Input 
            className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
            value={localEdu.endDate} 
            onChange={(e) => handleChange('endDate', e.target.value)} 
            placeholder={t('endDatePlaceholder')} 
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('courses')}</Label>
        <Textarea
          value={(localEdu.courses ?? []).join('\n')}
          onChange={(e) =>
            handleChange(
              'courses',
              e.target.value
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
          placeholder={t('coursesPlaceholder')}
          className="min-h-[120px] rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all resize-none p-4"
        />
      </div>
    </div>
  );
};

export const EducationForm = () => {
  const t = useTranslations('Resume.forms');
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
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 bg-primary rounded-full" />
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">{t('educationTitle')}</h3>
        </div>
        <Button 
          onClick={addEducation} 
          size="sm" 
          variant="outline"
          className="gap-2 rounded-full border-primary/20 hover:border-primary/50 hover:bg-primary/5 bg-background transition-all duration-300"
        >
          <Plus className="h-4 w-4" /> {t('addEducation')}
        </Button>
      </div>

      {education.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-muted/20 border-2 border-dashed border-border/50 rounded-[2rem] space-y-4">
          <div className="p-4 bg-background rounded-full shadow-sm">
            <Plus className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{t('emptyEducation')}</p>
            <p className="text-xs text-muted-foreground/60">点击上方按钮添加你的教育经历</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {education.map((edu, index) => (
          <EducationItem 
            key={edu.id} 
            edu={edu} 
            index={index} 
            updateEducation={updateEducation} 
            removeEducation={removeEducation} 
          />
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

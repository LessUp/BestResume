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
    <div className="p-4 border border-border rounded-lg bg-card shadow-sm space-y-4 relative group">
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
          <Label>{t('institution')}</Label>
          <Input 
            value={localEdu.institution} 
            onChange={(e) => handleChange('institution', e.target.value)} 
            placeholder={t('institutionPlaceholder')} 
          />
        </div>
        <div className="space-y-2">
          <Label>{t('studyType')}</Label>
          <Input 
            value={localEdu.studyType} 
            onChange={(e) => handleChange('studyType', e.target.value)} 
            placeholder={t('studyTypePlaceholder')} 
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>{t('educationUrl')}</Label>
          <Input
            value={localEdu.url ?? ''}
            onChange={(e) => handleChange('url', e.target.value)}
            placeholder={t('educationUrlPlaceholder')}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('area')}</Label>
          <Input 
            value={localEdu.area} 
            onChange={(e) => handleChange('area', e.target.value)} 
            placeholder={t('areaPlaceholder')} 
          />
        </div>
        <div className="space-y-2">
          <Label>{t('score')}</Label>
          <Input 
            value={localEdu.score} 
            onChange={(e) => handleChange('score', e.target.value)} 
            placeholder={t('scorePlaceholder')} 
          />
        </div>
        <div className="space-y-2">
          <Label>{t('startDate')}</Label>
          <Input 
            value={localEdu.startDate} 
            onChange={(e) => handleChange('startDate', e.target.value)} 
            placeholder={t('startDatePlaceholder')} 
          />
        </div>
        <div className="space-y-2">
          <Label>{t('endDate')}</Label>
          <Input 
            value={localEdu.endDate} 
            onChange={(e) => handleChange('endDate', e.target.value)} 
            placeholder={t('endDatePlaceholder')} 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t('courses')}</Label>
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
          className="h-24"
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h2 className="text-lg font-semibold">{t('educationTitle')}</h2>
         <Button onClick={addEducation} size="sm" className="gap-2">
           <Plus className="h-4 w-4" /> {t('addEducation')}
         </Button>
      </div>

      {education.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
          {t('emptyEducation')}
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

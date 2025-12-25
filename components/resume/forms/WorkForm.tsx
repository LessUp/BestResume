import React, { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { ResumeData } from '@/types/resume';
import { useTranslations } from 'next-intl';

interface WorkItemProps {
  job: ResumeData['work'][0];
  index: number;
  updateWork: (index: number, work: Partial<ResumeData['work'][0]>) => void;
  removeWork: (index: number) => void;
}

const WorkItem = ({ job, index, updateWork, removeWork }: WorkItemProps) => {
  const [localJob, setLocalJob] = useState(job);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = useTranslations('Resume.forms');

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
    <div className="p-4 border border-border rounded-lg bg-card shadow-sm space-y-4 relative group">
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
          <Label>{t('companyName')}</Label>
          <Input 
            value={localJob.name} 
            onChange={(e) => handleChange('name', e.target.value)} 
            placeholder={t('companyNamePlaceholder')} 
          />
        </div>
        <div className="space-y-2">
          <Label>{t('position')}</Label>
          <Input 
            value={localJob.position} 
            onChange={(e) => handleChange('position', e.target.value)} 
            placeholder={t('positionPlaceholder')} 
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>{t('workUrl')}</Label>
          <Input
            value={localJob.url ?? ''}
            onChange={(e) => handleChange('url', e.target.value)}
            placeholder={t('workUrlPlaceholder')}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('startDate')}</Label>
          <Input 
            value={localJob.startDate} 
            onChange={(e) => handleChange('startDate', e.target.value)} 
            placeholder={t('startDatePlaceholder')} 
          />
        </div>
        <div className="space-y-2">
          <Label>{t('endDate')}</Label>
          <Input 
            value={localJob.endDate} 
            onChange={(e) => handleChange('endDate', e.target.value)} 
            placeholder={t('endDatePlaceholderPresent')} 
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>{t('workSummary')}</Label>
        <Textarea 
          value={localJob.summary} 
          onChange={(e) => handleChange('summary', e.target.value)} 
          placeholder={t('workSummaryPlaceholder')} 
          className="h-24"
        />
      </div>
      <div className="space-y-2">
        <Label>{t('workHighlights')}</Label>
        <Textarea
          value={(localJob.highlights ?? []).join('\n')}
          onChange={(e) =>
            handleChange(
              'highlights',
              e.target.value
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
          placeholder={t('workHighlightsPlaceholder')}
          className="h-24"
        />
      </div>
    </div>
  );
};

export const WorkForm = () => {
  const t = useTranslations('Resume.forms');
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
         <h2 className="text-lg font-semibold">{t('workTitle')}</h2>
         <Button onClick={addWork} size="sm" className="gap-2">
           <Plus className="h-4 w-4" /> {t('addPosition')}
         </Button>
      </div>

      {work.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-border rounded-lg">
          {t('emptyWork')}
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

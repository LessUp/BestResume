import React, { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Briefcase } from 'lucide-react';
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
    <div className="p-6 border border-border/50 rounded-[2rem] bg-card/50 backdrop-blur-sm shadow-sm space-y-6 relative group transition-all duration-300 hover:border-primary/30 hover:shadow-md">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-destructive/10 hover:text-destructive rounded-full"
        onClick={() => removeWork(index)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('companyName')}</Label>
          <Input
            className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
            value={localJob.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder={t('companyNamePlaceholder')}
          />
        </div>
        <div className="space-y-2.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('position')}</Label>
          <Input
            className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
            value={localJob.position}
            onChange={(e) => handleChange('position', e.target.value)}
            placeholder={t('positionPlaceholder')}
          />
        </div>
        <div className="space-y-2.5 md:col-span-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('workUrl')}</Label>
          <Input
            className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
            value={localJob.url ?? ''}
            onChange={(e) => handleChange('url', e.target.value)}
            placeholder={t('workUrlPlaceholder')}
          />
        </div>
        <div className="space-y-2.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('startDate')}</Label>
          <Input
            className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
            value={localJob.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            placeholder={t('startDatePlaceholder')}
          />
        </div>
        <div className="space-y-2.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('endDate')}</Label>
          <Input
            className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
            value={localJob.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            placeholder={t('endDatePlaceholderPresent')}
          />
        </div>
      </div>
      <div className="space-y-2.5">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('workSummary')}</Label>
        <Textarea
          className="rounded-2xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all resize-none p-4"
          value={localJob.summary}
          onChange={(e) => handleChange('summary', e.target.value)}
          placeholder={t('workSummaryPlaceholder')}
          rows={3}
        />
      </div>
      <div className="space-y-2.5">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('workHighlights')}</Label>
        <Textarea
          className="rounded-2xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all resize-none p-4"
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
          rows={4}
        />
        <p className="text-[10px] text-muted-foreground ml-1">Tip: Each line will be a separate bullet point.</p>
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
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 bg-primary rounded-full" />
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">{t('workTitle')}</h3>
        </div>
        <Button
          onClick={addWork}
          size="sm"
          variant="outline"
          className="gap-2 rounded-full border-primary/20 hover:border-primary/50 hover:bg-primary/5 bg-background transition-all duration-300"
        >
          <Plus className="h-4 w-4" /> {t('addPosition')}
        </Button>
      </div>

      {work.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-muted/20 border-2 border-dashed border-border/50 rounded-[2rem] space-y-4">
          <div className="p-4 bg-background rounded-full shadow-sm">
            <Briefcase className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{t('emptyWork')}</p>
            <p className="text-xs text-muted-foreground/60">点击上方按钮添加你的工作经历</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {work.map((job, index) => (
          <WorkItem
            key={job.id}
            job={job}
            index={index}
            updateWork={updateWork}
            removeWork={removeWork}
          />
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

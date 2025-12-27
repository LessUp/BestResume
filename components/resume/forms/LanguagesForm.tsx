import React, { useEffect, useRef, useState } from 'react';
import { useResumeStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { ResumeData } from '@/types/resume';
import { useTranslations } from 'next-intl';

interface LanguageItemProps {
  item: ResumeData['languages'][0];
  index: number;
  updateLanguage: (index: number, language: Partial<ResumeData['languages'][0]>) => void;
  removeLanguage: (index: number) => void;
}

const LanguageItem = ({ item, index, updateLanguage, removeLanguage }: LanguageItemProps) => {
  const [localItem, setLocalItem] = useState(item);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = useTranslations('Resume.forms');

  useEffect(() => {
    setLocalItem(item);
  }, [item]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = (field: keyof ResumeData['languages'][0], value: string) => {
    setLocalItem((prev) => ({ ...prev, [field]: value }));

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      updateLanguage(index, { [field]: value });
    }, 500);
  };

  return (
    <div className="p-6 border border-border/50 rounded-[2rem] bg-card/50 backdrop-blur-sm shadow-sm space-y-6 relative group transition-all duration-300 hover:border-primary/30 hover:shadow-md">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-destructive/10 hover:text-destructive rounded-full"
        onClick={() => removeLanguage(index)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('languageName')}</Label>
          <Input
            className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
            value={localItem.language}
            onChange={(e) => handleChange('language', e.target.value)}
            placeholder={t('languageNamePlaceholder')}
          />
        </div>
        <div className="space-y-2.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('languageFluency')}</Label>
          <Input
            className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
            value={localItem.fluency}
            onChange={(e) => handleChange('fluency', e.target.value)}
            placeholder={t('languageFluencyPlaceholder')}
          />
        </div>
      </div>
    </div>
  );
};

export const LanguagesForm = () => {
  const t = useTranslations('Resume.forms');
  const languages = useResumeStore((state) => state.resumeData.languages);
  const addLanguage = useResumeStore((state) => state.addLanguage);
  const updateLanguage = useResumeStore((state) => state.updateLanguage);
  const removeLanguage = useResumeStore((state) => state.removeLanguage);
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(languages.length);

  useEffect(() => {
    if (languages.length > prevLengthRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevLengthRef.current = languages.length;
  }, [languages.length]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="h-4 w-1 bg-primary rounded-full" />
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">{t('languagesTitle')}</h3>
        </div>
        <Button 
          onClick={addLanguage} 
          size="sm" 
          variant="outline"
          className="gap-2 rounded-full border-primary/20 hover:border-primary/50 hover:bg-primary/5 bg-background transition-all duration-300"
        >
          <Plus className="h-4 w-4" /> {t('addLanguage')}
        </Button>
      </div>

      {languages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-muted/20 border-2 border-dashed border-border/50 rounded-[2rem] space-y-4">
          <div className="p-4 bg-background rounded-full shadow-sm">
            <Plus className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{t('emptyLanguages')}</p>
            <p className="text-xs text-muted-foreground/60">点击上方按钮添加你的语言能力</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {languages.map((item, index) => (
          <LanguageItem
            key={item.id}
            item={item}
            index={index}
            updateLanguage={updateLanguage}
            removeLanguage={removeLanguage}
          />
        ))}
      </div>
      <div ref={bottomRef} />
    </div>
  );
};

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
    <div className="p-4 border rounded-lg bg-white shadow-sm space-y-4 relative group">
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => removeLanguage(index)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('languageName')}</Label>
          <Input
            value={localItem.language}
            onChange={(e) => handleChange('language', e.target.value)}
            placeholder={t('languageNamePlaceholder')}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('languageFluency')}</Label>
          <Input
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{t('languagesTitle')}</h2>
        <Button onClick={addLanguage} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> {t('addLanguage')}
        </Button>
      </div>

      {languages.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
          {t('emptyLanguages')}
        </div>
      )}

      {languages.map((item, index) => (
        <LanguageItem
          key={item.id}
          item={item}
          index={index}
          updateLanguage={updateLanguage}
          removeLanguage={removeLanguage}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

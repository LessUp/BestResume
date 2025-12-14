import React, { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '@/lib/store';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const BasicsForm = () => {
  const basics = useResumeStore((state) => state.resumeData.basics);
  const updateBasics = useResumeStore((state) => state.updateBasics);
  const t = useTranslations('Resume.forms');
  
  // Local state for immediate feedback
  const [formData, setFormData] = useState(basics);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local state when store changes externally (e.g. initial load or undo)
  useEffect(() => {
    setFormData(basics);
  }, [basics]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Update local state immediately
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Debounce store update
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      updateBasics({ [name]: value });
    }, 500);
  };

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold">{t('basicsTitle')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t('fullName')}</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder={t('fullNamePlaceholder')} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="label">{t('jobTitle')}</Label>
          <Input 
            id="label" 
            name="label" 
            value={formData.label} 
            onChange={handleChange} 
            placeholder={t('jobTitlePlaceholder')} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t('email')}</Label>
          <Input 
            id="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder={t('emailPlaceholder')} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t('phone')}</Label>
          <Input 
            id="phone" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder={t('phonePlaceholder')} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">{t('website')}</Label>
          <Input 
            id="url" 
            name="url" 
            value={formData.url} 
            onChange={handleChange} 
            placeholder={t('websitePlaceholder')} 
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="summary">{t('summary')}</Label>
        <Textarea 
          id="summary" 
          name="summary" 
          value={formData.summary} 
          onChange={handleChange} 
          placeholder={t('summaryPlaceholder')} 
          className="h-32"
        />
      </div>
    </div>
  );
};

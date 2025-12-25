import React from 'react';
import { useResumeStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { LayoutTemplate, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

const templates = [
  {
    id: 'standard',
    nameKey: 'standardName',
    descKey: 'standardDesc',
    color: 'bg-muted'
  },
  {
    id: 'modern',
    nameKey: 'modernName',
    descKey: 'modernDesc',
    color: 'bg-foreground'
  },
  {
    id: 'minimal',
    nameKey: 'minimalName',
    descKey: 'minimalDesc',
    color: 'bg-card border border-border'
  }
];

export const TemplateSelector = () => {
  const { resumeData, setTemplateId } = useResumeStore();
  const t = useTranslations('Templates');
  const currentId = resumeData.meta.templateId;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <LayoutTemplate className="h-6 w-6 text-primary" />
        <h2 className="text-lg font-semibold">{t('title')}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {templates.map((template) => (
          <div 
            key={template.id}
            onClick={() => setTemplateId(template.id)}
            className={cn(
              "relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-primary/50 hover:shadow-md",
              currentId === template.id ? "border-primary bg-primary/5" : "border-transparent bg-card shadow-sm"
            )}
          >
            <div className="flex items-start gap-4">
              {/* Visual Preview Placeholder */}
              <div className={cn("w-16 h-20 rounded border border-border shadow-sm flex-shrink-0", template.color)}></div>
              
              <div className="flex-1">
                <h3 className="font-bold text-foreground">{t(template.nameKey)}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t(template.descKey)}</p>
              </div>

              {currentId === template.id && (
                <CheckCircle2 className="h-6 w-6 text-primary" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

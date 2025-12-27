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
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <div 
            key={template.id}
            onClick={() => setTemplateId(template.id)}
            className={cn(
              "group relative p-6 rounded-[2rem] border transition-all duration-500 cursor-pointer overflow-hidden",
              currentId === template.id 
                ? "border-primary bg-primary/[0.03] shadow-2xl shadow-primary/10" 
                : "border-border/50 bg-background hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
            )}
          >
            {/* Background Accent */}
            <div className={cn(
              "absolute -right-4 -bottom-4 h-32 w-32 rounded-full opacity-[0.03] blur-3xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-[0.05]",
              currentId === template.id ? "bg-primary" : "bg-foreground"
            )} />

            <div className="flex flex-col gap-6 relative z-10">
              {/* Visual Preview Placeholder */}
              <div className={cn(
                "aspect-[1/1.2] w-full rounded-2xl border border-border/50 shadow-sm flex flex-col p-4 gap-3 transition-transform duration-500 group-hover:scale-[1.02]",
                template.color
              )}>
                 <div className="h-2 w-1/3 bg-foreground/10 rounded-full" />
                 <div className="flex-1 space-y-2">
                    <div className="h-1.5 w-full bg-foreground/5 rounded-full" />
                    <div className="h-1.5 w-5/6 bg-foreground/5 rounded-full" />
                    <div className="h-1.5 w-4/6 bg-foreground/5 rounded-full" />
                 </div>
                 <div className="h-6 w-full bg-primary/10 rounded-lg mt-auto" />
              </div>
              
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    "text-lg font-bold transition-colors duration-300",
                    currentId === template.id ? "text-primary" : "text-foreground group-hover:text-primary"
                  )}>
                    {t(template.nameKey)}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {t(template.descKey)}
                  </p>
                </div>

                {currentId === template.id && (
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

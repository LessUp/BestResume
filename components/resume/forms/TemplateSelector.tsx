import React from 'react';
import { useResumeStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { LayoutTemplate, CheckCircle2 } from 'lucide-react';

const templates = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Classic and professional. Good for ATS.',
    color: 'bg-gray-100'
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Two-column layout with a dark sidebar.',
    color: 'bg-slate-900'
  },
  {
    id: 'minimal',
    name: 'Minimalist',
    description: 'Clean, whitespace-heavy, typography focused.',
    color: 'bg-white border'
  }
];

export const TemplateSelector = () => {
  const { resumeData, setTemplateId } = useResumeStore();
  const currentId = resumeData.meta.templateId;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <LayoutTemplate className="h-6 w-6 text-blue-600" />
        <h2 className="text-lg font-semibold">Choose Template</h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {templates.map((template) => (
          <div 
            key={template.id}
            onClick={() => setTemplateId(template.id)}
            className={cn(
              "relative p-4 rounded-xl border-2 cursor-pointer transition-all hover:border-blue-400 hover:shadow-md",
              currentId === template.id ? "border-blue-600 bg-blue-50/50" : "border-transparent bg-white shadow-sm"
            )}
          >
            <div className="flex items-start gap-4">
              {/* Visual Preview Placeholder */}
              <div className={cn("w-16 h-20 rounded border shadow-sm flex-shrink-0", template.color)}></div>
              
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{template.description}</p>
              </div>

              {currentId === template.id && (
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

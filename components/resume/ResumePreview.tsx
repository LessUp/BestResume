import React from 'react';
import { useResumeStore } from '@/lib/store';
import { StandardTemplate } from './templates/StandardTemplate';
import { ModernTemplate } from './templates/ModernTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';

export const ResumePreview = () => {
  const { resumeData } = useResumeStore();
  const { templateId } = resumeData.meta;

  const renderTemplate = () => {
    switch (templateId) {
      case 'modern':
        return <ModernTemplate data={resumeData} />;
      case 'minimal':
        return <MinimalTemplate data={resumeData} />;
      case 'standard':
      default:
        return <StandardTemplate data={resumeData} />;
    }
  };
  
  return (
    <div className="h-full bg-gray-100 p-8 overflow-y-auto rounded-lg border shadow-inner flex justify-center print:p-0 print:bg-white print:shadow-none print:border-none print:block">
      <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl origin-top scale-[0.6] md:scale-[0.7] lg:scale-[0.8] xl:scale-100 transition-transform print:shadow-none print:scale-100 print:w-full">
        {renderTemplate()}
      </div>
    </div>
  );
};

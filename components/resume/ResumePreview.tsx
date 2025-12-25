import React, { useEffect, useRef, useState } from 'react';
import { useResumeStore } from '@/lib/store';
import { StandardTemplate } from './templates/StandardTemplate';
import { ModernTemplate } from './templates/ModernTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';

export const ResumePreview = () => {
  const templateId = useResumeStore(state => state.resumeData.meta.templateId);
  const basics = useResumeStore(state => state.resumeData.basics);
  const work = useResumeStore(state => state.resumeData.work);
  const education = useResumeStore(state => state.resumeData.education);
  const skills = useResumeStore(state => state.resumeData.skills);
  const projects = useResumeStore(state => state.resumeData.projects);
  const languages = useResumeStore(state => state.resumeData.languages);

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      // A4 width is 210mm. At 96dpi ~794px. 
      // We add some padding (e.g. 32px on each side = 64px total)
      const targetWidth = 794; 
      const padding = 48; // Total horizontal padding
      
      const availableWidth = Math.max(containerWidth - padding, 0);
      
      // Calculate scale, cap at 1.2 to prevent too much pixelation, min 0.3
      const newScale = Math.min(Math.max(availableWidth / targetWidth, 0.3), 1.2);
      
      setScale(newScale);
    };

    // Initial calc
    updateScale();

    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const renderTemplate = () => {
    const props = { basics, work, education, skills, projects, languages };
    
    switch (templateId) {
      case 'modern':
        return <ModernTemplate {...props} />;
      case 'minimal':
        return <MinimalTemplate {...props} />;
      case 'standard':
      default:
        return <StandardTemplate {...props} />;
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className="h-full w-full bg-muted/30 flex justify-center overflow-y-auto overflow-x-hidden scrollbar-hide print:bg-white print:block print:overflow-visible"
    >
      <div 
        style={{ 
          transform: `scale(${scale})`,
          marginBottom: `${(scale * 40)}px`,
          marginTop: '2rem'
        }}
        className="origin-top transition-transform duration-100 ease-out print:scale-100 print:m-0 print:w-full"
      >
        <div 
          className="w-[210mm] min-h-[297mm] bg-white shadow-xl print:shadow-none"
        >
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};

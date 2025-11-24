import React from 'react';
import { ResumeData } from '@/types/resume';

interface TemplateProps {
  data: ResumeData;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { basics, work, education, skills, projects } = data;

  return (
    <div className="p-12 bg-white text-gray-900 min-h-[1000px] font-sans tracking-wide">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-3xl font-light uppercase tracking-[0.2em] mb-3">{basics.name}</h1>
        <div className="text-sm text-gray-500 uppercase tracking-widest mb-4">{basics.label}</div>
        <div className="text-xs text-gray-400 flex justify-center gap-6 uppercase tracking-wider">
          {basics.email && <span>{basics.email}</span>}
          {basics.phone && <span>{basics.phone}</span>}
          {basics.location.city && <span>{basics.location.city}</span>}
        </div>
      </header>

      {/* Summary */}
      {basics.summary && (
        <section className="mb-10 max-w-2xl mx-auto text-center">
          <p className="text-gray-600 leading-relaxed text-sm italic">{basics.summary}</p>
        </section>
      )}

      <div className="grid grid-cols-1 gap-10">
        {/* Experience */}
        {work.length > 0 && (
          <section>
            <h2 className="text-center text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-2 mb-6 text-gray-800">Experience</h2>
            <div className="space-y-8">
              {work.map((job, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-right md:border-r md:border-gray-200 md:pr-6">
                    <div className="font-bold text-sm">{job.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{job.startDate} - {job.endDate}</div>
                  </div>
                  <div className="md:col-span-3 md:pl-2">
                     <div className="font-bold text-sm mb-2">{job.position}</div>
                     <p className="text-sm text-gray-600 leading-relaxed mb-2">{job.summary}</p>
                     <ul className="list-disc list-inside text-xs text-gray-500 space-y-1">
                        {job.highlights.map((hl, i) => <li key={i}>{hl}</li>)}
                     </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Education */}
         {education.length > 0 && (
          <section>
            <h2 className="text-center text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-2 mb-6 text-gray-800">Education</h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="flex justify-between items-end max-w-2xl mx-auto">
                  <div>
                    <div className="font-bold text-sm">{edu.institution}</div>
                    <div className="text-xs text-gray-500">{edu.studyType} in {edu.area}</div>
                  </div>
                  <div className="text-xs text-gray-400">{edu.startDate} - {edu.endDate}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills & Projects Combined */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {skills.length > 0 && (
             <section>
                <h2 className="text-center text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-2 mb-6 text-gray-800">Skills</h2>
                <div className="text-center">
                  {skills.map((skill, index) => (
                    <div key={index} className="mb-3">
                      <span className="text-xs font-bold uppercase mr-2 block mb-1">{skill.name}</span>
                      <span className="text-xs text-gray-500">{skill.keywords.join(" · ")}</span>
                    </div>
                  ))}
                </div>
             </section>
           )}

           {projects.length > 0 && (
             <section>
                <h2 className="text-center text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-2 mb-6 text-gray-800">Projects</h2>
                 <div className="space-y-4">
                  {projects.map((project, index) => (
                    <div key={index} className="text-center">
                      <div className="font-bold text-sm">{project.name}</div>
                      <p className="text-xs text-gray-500 mt-1">{project.description}</p>
                    </div>
                  ))}
                </div>
             </section>
           )}
        </div>
      </div>
    </div>
  );
};

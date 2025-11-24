import React from 'react';
import { ResumeData } from '@/types/resume';

interface TemplateProps {
  data: ResumeData;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { basics, work, education, skills, projects } = data;

  return (
    <div className="flex min-h-[1000px] bg-white text-gray-800 font-sans">
      {/* Sidebar */}
      <aside className="w-1/3 bg-slate-900 text-white p-6 flex flex-col gap-6">
        <div className="text-center">
          <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center border-4 border-gray-600">
             <span className="text-4xl font-bold">{basics.name.charAt(0)}</span>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-wider mb-2">{basics.name}</h1>
          <p className="text-blue-300 font-medium">{basics.label}</p>
        </div>

        <div className="space-y-2 text-sm text-gray-300 border-t border-gray-700 pt-6">
           {basics.email && <div className="flex items-center gap-2"><span>✉</span> {basics.email}</div>}
           {basics.phone && <div className="flex items-center gap-2"><span>☎</span> {basics.phone}</div>}
           {basics.url && <div className="flex items-center gap-2"><span>🌐</span> {basics.url}</div>}
           {basics.location.city && <div className="flex items-center gap-2"><span>📍</span> {basics.location.city}, {basics.location.countryCode}</div>}
        </div>

        {skills.length > 0 && (
          <div className="pt-6 border-t border-gray-700">
            <h3 className="text-lg font-bold uppercase mb-4 text-blue-400 tracking-widest">Skills</h3>
            <div className="space-y-4">
              {skills.map((skill, i) => (
                <div key={i}>
                  <div className="font-semibold mb-1">{skill.name}</div>
                  <div className="flex flex-wrap gap-1">
                     {skill.keywords.map((k, j) => (
                       <span key={j} className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300">{k}</span>
                     ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {education.length > 0 && (
           <div className="pt-6 border-t border-gray-700">
            <h3 className="text-lg font-bold uppercase mb-4 text-blue-400 tracking-widest">Education</h3>
            <div className="space-y-4">
              {education.map((edu, i) => (
                <div key={i}>
                  <div className="font-bold">{edu.institution}</div>
                  <div className="text-sm text-gray-400">{edu.studyType} in {edu.area}</div>
                  <div className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="w-2/3 p-8 bg-white">
        {basics.summary && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 uppercase border-b-4 border-blue-500 pb-2 mb-4 inline-block">Profile</h2>
            <p className="text-gray-600 leading-relaxed">{basics.summary}</p>
          </section>
        )}

        {work.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 uppercase border-b-4 border-blue-500 pb-2 mb-6 inline-block">Experience</h2>
            <div className="space-y-6">
              {work.map((job, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-gray-200">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 bg-blue-500 rounded-full border-4 border-white"></div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-xl font-bold text-gray-800">{job.position}</h3>
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{job.startDate} - {job.endDate}</span>
                  </div>
                  <div className="text-md font-medium text-gray-500 mb-2">{job.name}</div>
                  <p className="text-gray-600 text-sm mb-2">{job.summary}</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                     {job.highlights.map((hl, k) => <li key={k}>{hl}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section className="mb-8">
             <h2 className="text-2xl font-bold text-slate-800 uppercase border-b-4 border-blue-500 pb-2 mb-6 inline-block">Projects</h2>
             <div className="grid grid-cols-1 gap-4">
               {projects.map((project, i) => (
                 <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                       <h3 className="font-bold text-gray-800">{project.name}</h3>
                       {project.url && <a href={project.url} className="text-xs text-blue-500 hover:underline">Link ↗</a>}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.keywords.map((k, j) => (
                        <span key={j} className="text-xs text-gray-500 bg-white border border-gray-200 px-1.5 py-0.5 rounded">{k}</span>
                      ))}
                    </div>
                 </div>
               ))}
             </div>
          </section>
        )}
      </main>
    </div>
  );
};

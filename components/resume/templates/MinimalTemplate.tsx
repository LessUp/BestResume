import React from 'react';
import { ResumeData } from '@/types/resume';
import { useTranslations } from 'next-intl';

interface TemplateProps {
  basics: ResumeData['basics'];
  work: ResumeData['work'];
  education: ResumeData['education'];
  skills: ResumeData['skills'];
  projects: ResumeData['projects'];
  languages: ResumeData['languages'];
}

export const MinimalTemplate: React.FC<TemplateProps> = React.memo(({ basics, work, education, skills, projects, languages }) => {
  const t = useTranslations('Resume.templates');

  return (
    <div className="p-12 bg-white text-gray-900 min-h-[297mm] font-sans tracking-wide print:p-0">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-3xl font-light uppercase tracking-[0.2em] mb-3">{basics.name}</h1>
        <div className="text-sm text-gray-500 uppercase tracking-widest mb-4">{basics.label}</div>
        <div className="text-xs text-gray-400 flex justify-center gap-6 uppercase tracking-wider">
          {basics.email && <span>{basics.email}</span>}
          {basics.phone && <span>{basics.phone}</span>}
          {basics.url && <span>{basics.url}</span>}
          {basics.location.city && <span>{basics.location.city}</span>}
        </div>

        {basics.profiles && basics.profiles.length > 0 && (
          <div className="mt-4 text-[10px] text-gray-400 flex flex-wrap justify-center gap-4 uppercase tracking-wider">
            {basics.profiles.map((profile, i) => {
              const label = profile.url
                ? profile.url
                : `${profile.network}${profile.username ? `: ${profile.username}` : ''}`;

              if (!label.trim()) return null;

              return <span key={`${profile.network}-${profile.username}-${i}`}>{label}</span>;
            })}
          </div>
        )}
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
            <h2 className="text-center text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-2 mb-6 text-gray-800">{t('experience')}</h2>
            <div className="space-y-8">
              {work.map((job, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-right md:border-r md:border-gray-200 md:pr-6">
                    <div className="font-bold text-sm">{job.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{job.startDate} - {job.endDate}</div>
                  </div>
                  <div className="md:col-span-3 md:pl-2">
                     <div className="font-bold text-sm mb-2">{job.position}</div>
                     {job.url && <div className="text-xs text-gray-500 mb-2 break-words">{job.url}</div>}
                     <p className="text-sm text-gray-600 leading-relaxed mb-2 whitespace-pre-wrap">{job.summary}</p>
                     {job.highlights && job.highlights.length > 0 && (
                       <ul className="list-disc list-inside text-xs text-gray-500 space-y-1">
                          {job.highlights.map((hl, i) => <li key={i}>{hl}</li>)}
                       </ul>
                     )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Education */}
         {education.length > 0 && (
          <section>
            <h2 className="text-center text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-2 mb-6 text-gray-800">{t('education')}</h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="flex justify-between items-end max-w-2xl mx-auto w-full">
                  <div>
                    <div className="font-bold text-sm">{edu.institution}</div>
                    <div className="text-xs text-gray-500">{t('degreeInArea', { studyType: edu.studyType, area: edu.area })}</div>
                    {edu.url && <div className="text-[10px] text-gray-400 break-words">{edu.url}</div>}
                    {edu.courses && edu.courses.length > 0 && (
                      <div className="text-[10px] text-gray-400">
                        {t('courses')}: {edu.courses.join(', ')}
                      </div>
                    )}
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
                <h2 className="text-center text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-2 mb-6 text-gray-800">{t('skills')}</h2>
                <div className="text-center">
                  {skills.map((skill, index) => (
                    <div key={index} className="mb-3">
                      <span className="text-xs font-bold uppercase mr-2 block mb-1">
                        {skill.name}
                        {skill.level ? <span className="ml-2 text-[10px] text-gray-400">{skill.level}</span> : null}
                      </span>
                      <span className="text-xs text-gray-500">{skill.keywords.join(" · ")}</span>
                    </div>
                  ))}
                </div>
             </section>
           )}

           {projects.length > 0 && (
             <section>
                <h2 className="text-center text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-2 mb-6 text-gray-800">{t('projects')}</h2>
                 <div className="space-y-4">
                  {projects.map((project, index) => (
                    <div key={index} className="text-center">
                      <div className="font-bold text-sm">{project.name}</div>
                      {project.roles && project.roles.length > 0 && (
                        <div className="text-[10px] text-gray-400 mt-1">
                          {t('roles')}: {project.roles.join(', ')}
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1 whitespace-pre-wrap">{project.description}</p>
                      {project.highlights && project.highlights.length > 0 && (
                        <div className="mt-2 text-[10px] text-gray-500 space-y-1">
                          {project.highlights.map((hl, i) => (
                            <div key={i}>{hl}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
             </section>
           )}

           {languages.length > 0 && (
             <section className="md:col-span-2">
               <h2 className="text-center text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-2 mb-6 text-gray-800">{t('languages')}</h2>
               <div className="text-center text-xs text-gray-500 space-y-2">
                 {languages.map((language, index) => (
                   <div key={language.id || index}>
                     {language.language}
                     {language.fluency ? <span className="text-gray-400"> {`· ${language.fluency}`}</span> : null}
                   </div>
                 ))}
               </div>
             </section>
           )}
        </div>
      </div>
    </div>
  );
});

MinimalTemplate.displayName = 'MinimalTemplate';

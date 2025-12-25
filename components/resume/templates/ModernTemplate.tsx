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

export const ModernTemplate: React.FC<TemplateProps> = React.memo(({ basics, work, education, skills, projects, languages }) => {
  const t = useTranslations('Resume.templates');

  return (
    <div className="flex min-h-[297mm] bg-white text-slate-800 font-sans print:h-full">
      {/* Sidebar */}
      <aside className="w-1/3 bg-slate-900 text-white p-6 flex flex-col gap-6 print:bg-slate-900 print:text-white print:-webkit-print-color-adjust-exact">
        <div className="text-center">
          <div className="w-32 h-32 bg-slate-700 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center border-4 border-slate-600">
             {basics.image ? (
               <img src={basics.image} alt={basics.name} className="w-full h-full object-cover" />
             ) : (
               <span className="text-4xl font-bold">{basics.name.charAt(0)}</span>
             )}
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-wider mb-2">{basics.name}</h1>
          <p className="text-blue-300 font-medium">{basics.label}</p>
        </div>

        <div className="space-y-2 text-sm text-slate-300 border-t border-slate-700 pt-6">
           {basics.email && <div className="flex items-center gap-2"><span className="w-4">✉</span> {basics.email}</div>}
           {basics.phone && <div className="flex items-center gap-2"><span className="w-4">☎</span> {basics.phone}</div>}
           {basics.url && <div className="flex items-center gap-2"><span className="w-4">🌐</span> {basics.url}</div>}
           {basics.location.city && <div className="flex items-center gap-2"><span className="w-4">📍</span> {basics.location.city}, {basics.location.countryCode}</div>}
           {basics.profiles &&
             basics.profiles.map((profile, i) => {
               const label = profile.url
                 ? profile.url
                 : `${profile.network}${profile.username ? `: ${profile.username}` : ''}`;

               if (!label.trim()) return null;

               return (
                 <div key={`${profile.network}-${i}`} className="flex items-center gap-2">
                   <span className="w-4">🔗</span>
                   <span className="break-all">{label}</span>
                 </div>
               );
             })}
        </div>

        {skills.length > 0 && (
          <div className="border-t border-slate-700 pt-6">
            <h2 className="text-lg font-bold uppercase tracking-widest mb-4 text-blue-300">{t('skills')}</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <div key={i} className="mb-2 w-full">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold">{skill.name}</span>
                    <span className="text-slate-400">{skill.level}</span>
                  </div>
                  {skill.keywords.length > 0 && (
                    <div className="text-xs text-slate-400 leading-tight">
                      {skill.keywords.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
           <div className="pt-6 border-t border-slate-700">
            <h3 className="text-lg font-bold uppercase mb-4 text-blue-400 tracking-widest">{t('education')}</h3>
            <div className="space-y-4">
              {education.map((edu, i) => (
                <div key={i}>
                  <div className="font-bold">{edu.institution}</div>
                  <div className="text-sm text-slate-500">{t('degreeInArea', { studyType: edu.studyType, area: edu.area })}</div>
                  <div className="text-xs text-slate-500">{edu.startDate} - {edu.endDate}</div>
                  {edu.url && <div className="text-xs text-blue-300 break-words">{edu.url}</div>}
                  {edu.courses && edu.courses.length > 0 && (
                    <div className="text-xs text-slate-500">
                      {t('courses')}: {edu.courses.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {languages.length > 0 && (
          <div className="border-t border-slate-700 pt-6">
            <h2 className="text-lg font-bold uppercase tracking-widest mb-4 text-blue-300">{t('languages')}</h2>
            <div className="space-y-2 text-sm">
              {languages.map((lang, i) => (
                <div key={i} className="flex justify-between">
                  <span>{lang.language}</span>
                  <span className="text-slate-400">{lang.fluency}</span>
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
            <h2 className="text-2xl font-bold text-slate-800 uppercase border-b-4 border-blue-500 pb-2 mb-4 inline-block">{t('profile')}</h2>
            <p className="text-slate-600 leading-relaxed">{basics.summary}</p>
          </section>
        )}

        {work.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 uppercase border-b-4 border-blue-500 pb-2 mb-6 inline-block">{t('experience')}</h2>
            <div className="space-y-6">
              {work.map((job, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-slate-200">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-white"></div>
                  <div className="mb-1">
                    <h3 className="text-xl font-bold text-slate-800">{job.position}</h3>
                    <div className="text-blue-600 font-semibold">{job.name}</div>
                  </div>
                  <div className="text-sm text-slate-500 mb-2 italic">
                    {job.startDate} - {job.endDate}
                  </div>
                  <p className="text-sm text-slate-600 mb-2 whitespace-pre-wrap">{job.summary}</p>
                  {job.highlights && job.highlights.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                      {job.highlights.map((hl, k) => <li key={k}>{hl}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 uppercase border-b-4 border-blue-500 pb-2 mb-6 inline-block">{t('education')}</h2>
            <div className="space-y-6">
              {education.map((edu, i) => (
                <div key={i} className="relative pl-4 border-l-2 border-slate-200">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-300 border-4 border-white"></div>
                  <h3 className="text-lg font-bold text-slate-800">{edu.institution}</h3>
                  <div className="text-slate-700 font-medium">{t('degreeInArea', { studyType: edu.studyType, area: edu.area })}</div>
                  <div className="text-sm text-slate-500 mb-1">{edu.startDate} - {edu.endDate}</div>
                  {edu.score && <div className="text-sm text-slate-600">{t('gpa')}: {edu.score}</div>}
                  {edu.courses && edu.courses.length > 0 && (
                    <div className="text-sm text-slate-500 mt-1">
                      {t('courses')}: {edu.courses.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section className="mb-8">
             <h2 className="text-2xl font-bold text-slate-800 uppercase border-b-4 border-blue-500 pb-2 mb-6 inline-block">{t('projects')}</h2>
             <div className="grid grid-cols-1 gap-4">
               {projects.map((project, i) => (
                 <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-100 print:bg-slate-50">
                    <div className="flex justify-between items-center mb-2">
                       <h3 className="font-bold text-slate-800">{project.name}</h3>
                       {project.url && <a href={project.url} className="text-xs text-blue-500 hover:underline">{t('link')} ↗</a>}
                    </div>
                    {project.roles && project.roles.length > 0 && (
                      <div className="text-xs text-slate-500 mb-2">
                        {t('roles')}: {project.roles.join(', ')}
                      </div>
                    )}
                    <p className="text-sm text-slate-600 mb-2 whitespace-pre-wrap">{project.description}</p>
                    {project.highlights && project.highlights.length > 0 && (
                      <ul className="list-disc list-inside text-xs text-slate-500 space-y-1 mb-2">
                        {project.highlights.map((hl, k) => (
                          <li key={k}>{hl}</li>
                        ))}
                      </ul>
                    )}
                    <div className="flex flex-wrap gap-1">
                      {project.keywords.map((k, j) => (
                        <span key={j} className="text-xs text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">{k}</span>
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
});

ModernTemplate.displayName = 'ModernTemplate';

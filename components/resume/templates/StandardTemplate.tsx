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

export const StandardTemplate: React.FC<TemplateProps> = React.memo(({ basics, work, education, skills, projects, languages }) => {
  const t = useTranslations('Resume.templates');

  return (
    <div className="p-8 bg-white text-left text-slate-900 min-h-[297mm] shadow-md font-serif print:shadow-none print:p-0">
      {/* Header */}
      <header className="border-b-2 border-slate-800 pb-4 mb-6">
        <h1 className="text-4xl font-bold uppercase tracking-wide mb-2">{basics.name}</h1>
        <div className="text-lg font-medium text-slate-600 mb-2">{basics.label}</div>
        <div className="text-sm text-slate-500 flex flex-wrap gap-4">
          {basics.email && <span>{basics.email}</span>}
          {basics.phone && <span>{basics.phone}</span>}
          {basics.url && <span>{basics.url}</span>}
          {basics.location.city && <span>{basics.location.city}, {basics.location.countryCode}</span>}
          {basics.profiles &&
            basics.profiles.map((profile, i) => {
              if (profile.url) {
                return (
                  <span key={`${profile.network}-${profile.username}-${i}`}>{profile.url}</span>
                );
              }

              if (profile.network || profile.username) {
                return (
                  <span key={`${profile.network}-${profile.username}-${i}`}>
                    {profile.network}
                    {profile.username ? `: ${profile.username}` : ''}
                  </span>
                );
              }

              return null;
            })}
        </div>
      </header>

      {/* Summary */}
      {basics.summary && (
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b border-slate-300 mb-3 uppercase">{t('professionalSummary')}</h2>
          <p className="text-slate-700 leading-relaxed text-sm">{basics.summary}</p>
        </section>
      )}

      {/* Experience */}
      {work.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b border-slate-300 mb-3 uppercase">{t('experience')}</h2>
          <div className="space-y-4">
            {work.map((job, index) => (
              <div key={job.id || index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-bold">{job.position}</h3>
                  <span className="text-sm text-slate-600">
                    {job.startDate} - {job.endDate}
                  </span>
                </div>
                <div className="text-md font-semibold text-slate-700 mb-1">{job.name}</div>
                {job.url && <div className="text-sm text-blue-600 mb-1">{job.url}</div>}
                <p className="text-sm text-slate-600 mb-2 whitespace-pre-wrap">{job.summary}</p>
                {job.highlights && job.highlights.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    {job.highlights.map((hl, i) => (
                      <li key={i}>{hl}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b border-slate-300 mb-3 uppercase">{t('education')}</h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={edu.id || index}>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-lg font-bold">{edu.institution}</h3>
                  <span className="text-sm text-slate-600">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                {edu.url && <div className="text-sm text-blue-600">{edu.url}</div>}
                <div className="text-md text-slate-700">
                  {t('degreeInArea', { studyType: edu.studyType, area: edu.area })}
                </div>
                {edu.score && <div className="text-sm text-slate-500">{t('gpa')}: {edu.score}</div>}
                {edu.courses && edu.courses.length > 0 && (
                  <div className="text-sm text-slate-500">
                    {t('courses')}: {edu.courses.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b border-slate-300 mb-3 uppercase">{t('projects')}</h2>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={project.id || index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-bold">{project.name}</h3>
                  <span className="text-sm text-slate-600">
                     {project.startDate} - {project.endDate}
                  </span>
                </div>
                {project.url && <div className="text-sm text-blue-600 mb-1">{project.url}</div>}
                {project.roles && project.roles.length > 0 && (
                  <div className="text-sm text-slate-500 mb-1">
                    {t('roles')}: {project.roles.join(', ')}
                  </div>
                )}
                <p className="text-sm text-slate-600 mb-2 whitespace-pre-wrap">{project.description}</p>
                {project.highlights && project.highlights.length > 0 && (
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1 mb-2">
                    {project.highlights.map((hl, i) => (
                      <li key={i}>{hl}</li>
                    ))}
                  </ul>
                )}
                {project.keywords && project.keywords.length > 0 && (
                  <div className="text-sm text-slate-500">
                    {t('technologies')}: {project.keywords.join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b border-slate-300 mb-3 uppercase">{t('skills')}</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <div key={skill.id || index} className="mb-2">
                <span className="font-bold mr-2">
                  {skill.name}
                  {skill.level ? ` (${skill.level})` : ''}:
                </span>
                <span className="text-slate-600">{skill.keywords.join(", ")}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {languages.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-bold border-b border-slate-300 mb-3 uppercase">{t('languages')}</h2>
          <div className="space-y-1 text-sm text-slate-600">
            {languages.map((language, index) => (
              <div key={language.id || index}>
                {language.language}
                {language.fluency ? ` - ${language.fluency}` : ''}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
});

StandardTemplate.displayName = 'StandardTemplate';

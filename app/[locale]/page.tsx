"use client";

import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { FileText, Sparkles, ArrowRight, CheckCircle2, Layout, Zap, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const t = useTranslations('HomePage');
  const locale = useLocale();

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">BestResume</span>
          </div>
          <div className="flex items-center gap-4">
             <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            
            {/* Left Column: Content */}
            <div className="flex flex-col items-start text-left space-y-8">
              
              {/* Badge */}
              <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 animate-fade-in-up">
                <Sparkles className="mr-2 h-4 w-4 text-blue-600" />
                {t('badge')}
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-gray-900">
                {t('title')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  {t('subtitle')}
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                {t('description')}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 pt-4">
                <Link href={`/${locale}/editor/demo`} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full h-14 px-8 text-lg font-semibold rounded-full shadow-xl shadow-blue-600/20 hover:scale-105 transition-all duration-300 bg-blue-600 hover:bg-blue-700">
                    {t('getStarted')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href={`/${locale}/templates`} className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full h-14 px-8 text-lg font-semibold rounded-full border-2 hover:bg-gray-50 hover:text-gray-900 transition-all duration-300">
                    {t('viewTemplates')}
                  </Button>
                </Link>
              </div>

              {/* Trust/Stats text */}
              <div className="flex items-center gap-2 text-sm text-gray-500 pt-4">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>{t('trust.noCard')}</span>
                <span className="mx-2">•</span>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>{t('trust.freeTemplates')}</span>
              </div>
            </div>

            {/* Right Column: Visual Mockup */}
            <div className="relative lg:h-[600px] w-full flex items-center justify-center p-8 bg-gray-50 rounded-3xl border border-gray-100 shadow-2xl overflow-hidden">
               {/* Abstract Decorative Blobs */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
               
               {/* Resume Mockup Card */}
               <div className="relative w-full max-w-md aspect-[1/1.414] bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4 scale-95 hover:scale-100 transition-transform duration-500 cursor-default select-none">
                  {/* Mockup Header */}
                  <div className="flex gap-4 pb-6 border-b border-gray-100">
                    <div className="h-16 w-16 rounded-full bg-gray-100 animate-pulse" />
                    <div className="space-y-2 flex-1 pt-2">
                      <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-gray-100 rounded animate-pulse" />
                    </div>
                  </div>
                  
                  {/* Mockup Content Blocks */}
                  <div className="space-y-6 pt-2">
                     {/* Experience */}
                     <div className="space-y-3">
                        <div className="h-3 w-1/4 bg-blue-100 rounded" />
                        <div className="space-y-2 pl-2 border-l-2 border-gray-100">
                           <div className="h-2.5 w-full bg-gray-50 rounded" />
                           <div className="h-2.5 w-5/6 bg-gray-50 rounded" />
                           <div className="h-2.5 w-4/6 bg-gray-50 rounded" />
                        </div>
                     </div>
                     
                     {/* Education */}
                     <div className="space-y-3">
                        <div className="h-3 w-1/4 bg-blue-100 rounded" />
                        <div className="space-y-2 pl-2 border-l-2 border-gray-100">
                           <div className="h-2.5 w-full bg-gray-50 rounded" />
                           <div className="h-2.5 w-2/3 bg-gray-50 rounded" />
                        </div>
                     </div>

                     {/* Skills */}
                     <div className="flex gap-2 flex-wrap">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="h-6 w-16 bg-gray-100 rounded-md" />
                        ))}
                     </div>
                  </div>

                  {/* Floating UI Elements on top of mockup */}
                  <div className="absolute -right-4 top-1/4 bg-white p-3 rounded-lg shadow-lg border border-gray-100 flex items-center gap-3 animate-bounce-slow">
                    <div className="bg-green-100 p-2 rounded-md text-green-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div className="text-xs font-medium text-gray-600">
                      {t('atsScore.label')} <br/> <span className="text-lg font-bold text-gray-900">{t('atsScore.value')}</span>
                    </div>
                  </div>

                  <div className="absolute -left-4 bottom-1/4 bg-white p-3 rounded-lg shadow-lg border border-gray-100 flex items-center gap-3 animate-bounce-slow animation-delay-2000">
                    <div className="bg-blue-100 p-2 rounded-md text-blue-600">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div className="text-xs font-medium text-gray-600">
                      {t('aiOptimize.label')} <br/> <span className="text-sm font-bold text-gray-900">{t('aiOptimize.status')}</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             <FeatureCard 
               icon={<Layout className="h-6 w-6 text-blue-600" />}
               title={t('features.ats')}
               desc={t('features.atsDesc')}
             />
             <FeatureCard 
               icon={<Bot className="h-6 w-6 text-purple-600" />}
               title={t('features.ai')}
               desc={t('features.aiDesc')}
             />
             <FeatureCard 
               icon={<FileText className="h-6 w-6 text-indigo-600" />}
               title={t('features.templates')}
               desc={t('features.templatesDesc')}
             />
             <FeatureCard 
               icon={<Zap className="h-6 w-6 text-amber-500" />}
               title={t('features.realtime')}
               desc={t('features.realtimeDesc')}
             />
          </div>
          
        </div>
      </main>

      <footer className="border-t border-gray-100 py-12 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
            <FileText className="h-5 w-5" />
            <span className="font-bold">BestResume</span>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} BestResume. {t('footerNote')}
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg hover:bg-white transition-all duration-300 group">
      <div className="h-12 w-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}

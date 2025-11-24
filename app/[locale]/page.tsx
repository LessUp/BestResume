"use client";

import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { FileText, Sparkles } from "lucide-react";

export default function Home() {
  const t = useTranslations('HomePage');
  const locale = useLocale();

  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden selection:bg-blue-100">
      {/* Background Gradients */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] opacity-5" />
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.05)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <FileText className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">BestResume</span>
        </div>
        <LanguageSwitcher />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-20 pb-32 max-w-5xl mx-auto">
        <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-800 mb-8 animate-fade-in-up">
          <Sparkles className="mr-2 h-3.5 w-3.5" />
          <span className="font-medium">AI-Powered Resume Builder</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 max-w-4xl leading-[1.1]">
          {t('title')} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
            {t('subtitle')}
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-2xl leading-relaxed">
          {t('description')}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link 
            href={`/${locale}/editor/demo`}
            className="w-full sm:w-auto rounded-full bg-gray-900 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-gray-800 hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            {t('getStarted')}
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link 
            href={`/${locale}/templates`} 
            className="w-full sm:w-auto rounded-full bg-white px-8 py-4 text-lg font-semibold text-gray-900 shadow-md ring-1 ring-gray-200 hover:bg-gray-50 hover:ring-gray-300 transition-all duration-200"
          >
            {t('viewTemplates')}
          </Link>
        </div>

        {/* Stats or Trust indicators (Optional, just placeholders for look) */}
        <div className="mt-24 pt-8 border-t border-gray-100 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
           {/* Can add logos here later */}
        </div>
      </main>

      {/* Footer Simple */}
      <footer className="py-8 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} BestResume. All rights reserved.</p>
      </footer>
    </div>
  );
}

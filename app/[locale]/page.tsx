"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Home() {
  const t = useTranslations('HomePage');
  const locale = useLocale();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <main className="text-center max-w-3xl mx-auto p-6">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
          {t('title')} <br />
          <span className="text-blue-600">{t('subtitle')}</span>
        </h1>
        <p className="text-lg leading-8 text-gray-600 mb-8">
          {t('description')}
        </p>
        <div className="flex items-center justify-center gap-x-6">
          <Link 
            href={`/${locale}/editor/demo`}
            className="rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {t('getStarted')}
          </Link>
          <Link href={`/${locale}/templates`} className="text-lg font-semibold leading-6 text-gray-900">
            {t('viewTemplates')} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";
import { auth } from "@/auth";
import { getResumes } from "@/app/actions";
import { getUserStats, getCurrentUser } from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Eye, Download, TrendingUp, Search, Filter } from "lucide-react";
import { redirect } from "next/navigation";
import { ResumeCard } from "@/components/dashboard/ResumeCard";
import { getTranslations } from 'next-intl/server';
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent } from "@/components/ui/card";

type ResumeListItem = Awaited<ReturnType<typeof getResumes>>[number];

export default async function Dashboard({
  params,
}: {
  params: { locale: string };
}) {
  const session = await auth();
  const t = await getTranslations('Dashboard');
  const { locale } = params;

  if (!session?.user) {
    redirect(`/${locale}/auth/signin`);
  }

  const [resumes, stats, user] = await Promise.all([
    getResumes(),
    getUserStats(),
    getCurrentUser(),
  ]);

  const statsCards = [
    {
      label: t('totalResumes'),
      value: stats?.totalResumes || 0,
      icon: FileText,
      color: "blue"
    },
    {
      label: t('totalViews'),
      value: stats?.totalViews || 0,
      icon: Eye,
      color: "green"
    },
    {
      label: t('totalDownloads'),
      value: stats?.totalDownloads || 0,
      icon: Download,
      color: "purple"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar user={session.user} locale={locale} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t('welcomeBack')}, {user?.name?.split(' ')[0] || t('user')}!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{t('subtitle')}</p>
          </div>
          <Link href={`/${locale}/editor/new`}>
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              <Plus className="h-5 w-5" />
              {t('createNew')}
            </Button>
          </Link>
        </div>

        {/* Email verification & membership banners */}
        {user && (!user.emailVerified || !user.isMember) && (
          <div className="mb-8 space-y-3">
            {!user.emailVerified && (
              <div className="flex items-start gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-700/60 dark:bg-amber-950/40">
                <div className="h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-700 dark:text-amber-300">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">{t('verifyEmailTitle')}</p>
                  <p className="text-xs text-amber-800 dark:text-amber-200 mt-1">{t('verifyEmailDesc')}</p>
                </div>
              </div>
            )}

            {!user.isMember && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border border-blue-200 bg-blue-50 dark:border-blue-800/70 dark:bg-blue-950/40">
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-300">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">{t('membershipTitle')}</p>
                    <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">{t('membershipDesc')}</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Link href={`/${locale}/settings`}>
                    <Button variant="outline" size="sm" className="w-full">
                      {t('membershipCta')}
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className="bg-white dark:bg-gray-900 border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400' :
                      stat.color === 'green' ? 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400' :
                        'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400'
                    }`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resumes Section */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
          {/* Section Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('myResumes')} ({resumes.length})
              </h2>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    className="w-full sm:w-64 h-10 pl-10 pr-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('filter')}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Resumes Grid */}
          <div className="p-6">
            {resumes.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('noResumes')}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">{t('noResumesDesc')}</p>
                <Link href={`/${locale}/editor/new`}>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    {t('createResume')}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resumes.map((resume: ResumeListItem) => (
                  <ResumeCard key={resume.id} resume={resume} locale={locale} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

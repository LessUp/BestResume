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
import { cn } from "@/lib/utils";

type ResumeListItem = Awaited<ReturnType<typeof getResumes>>[number];

export default async function Dashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();
  const t = await getTranslations('Dashboard');
  const { locale } = await params;

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
    <div className="min-h-screen bg-muted/40">
      <Navbar user={session.user} locale={locale} />

      <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header with improved design */}
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">
              {t('welcomeBack')}, <span className="text-primary">{user?.name?.split(' ')[0] || t('user')}</span>!
            </h1>
            <p className="text-muted-foreground mt-2 text-lg font-medium">{t('subtitle')}</p>
          </div>
          <Link href={`/${locale}/editor/new`} className="relative">
            <Button size="lg" className="gap-2.5 w-full sm:w-auto shadow-xl shadow-primary/20 hover:scale-105 transition-transform h-12 px-6 font-bold">
              <Plus className="h-5 w-5" />
              {t('createNew')}
            </Button>
          </Link>
        </div>

        {/* Email verification & membership banners - more compact and modern */}
        {user && (!user.emailVerified || !user.isMember) && (
          <div className="mb-12 space-y-4">
            {!user.emailVerified && (
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-amber-900 dark:text-amber-200 backdrop-blur-sm">
                <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold tracking-tight">{t('verifyEmailTitle')}</p>
                  <p className="text-xs opacity-80 mt-0.5 font-medium">{t('verifyEmailDesc')}</p>
                </div>
              </div>
            )}

            {!user.isMember && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl border border-blue-500/20 bg-blue-500/5 text-blue-900 dark:text-blue-200 backdrop-blur-sm">
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 shadow-inner">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-base font-bold tracking-tight">{t('membershipTitle')}</p>
                    <p className="text-sm opacity-80 mt-0.5 font-medium">{t('membershipDesc')}</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Link href={`/${locale}/settings`}>
                    <Button variant="outline" size="sm" className="w-full h-10 px-6 rounded-xl border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold transition-all">
                      {t('membershipCta')}
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats Cards - Premium design */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {statsCards.map((stat, index) => (
            <Card key={index} className="group overflow-hidden border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8 relative">
                <div className={cn(
                  "absolute -right-4 -bottom-4 h-24 w-24 rounded-full opacity-5 blur-2xl",
                  stat.color === 'blue' ? "bg-blue-600" :
                  stat.color === 'green' ? "bg-green-600" :
                  "bg-purple-600"
                )} />
                <div className="flex items-center justify-between relative z-10">
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                      {stat.label}
                    </p>
                    <p className="text-4xl font-black text-foreground tracking-tighter">
                      {stat.value}
                    </p>
                  </div>
                  <div className={cn(
                    "h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300",
                    stat.color === 'blue' ? "bg-blue-500/10 text-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.1)]" :
                    stat.color === 'green' ? "bg-green-500/10 text-green-600 shadow-[0_0_20px_rgba(34,197,94,0.1)]" :
                    "bg-purple-500/10 text-purple-600 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
                  )}>
                    <stat.icon className="h-7 w-7" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resumes Section - cleaner container */}
        <div className="bg-card/30 backdrop-blur-md rounded-[2rem] shadow-2xl shadow-foreground/5 border border-border/50 overflow-hidden">
          {/* Section Header */}
          <div className="p-8 border-b border-border/50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-1 bg-primary rounded-full" />
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                  {t('myResumes')} <span className="text-muted-foreground/50 ml-2 font-medium">({resumes.length})</span>
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    className="w-full md:w-72 h-11 pl-10 pr-4 rounded-xl border border-border bg-background/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all font-medium"
                  />
                </div>
                <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-border bg-background/50 hover:bg-background transition-all">
                  <Filter className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </div>

          {/* Resumes Grid */}
          <div className="p-8">
            {resumes.length === 0 ? (
              <div className="text-center py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
                <div className="relative z-10">
                  <div className="mx-auto h-24 w-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-6 rotate-3 hover:rotate-0 transition-transform duration-500 shadow-inner">
                    <FileText className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground tracking-tight mb-2">{t('noResumes')}</h3>
                  <p className="text-muted-foreground mb-10 max-w-sm mx-auto text-lg font-medium leading-relaxed">{t('noResumesDesc')}</p>
                  <Link href={`/${locale}/editor/new`}>
                    <Button className="gap-2.5 h-14 px-10 rounded-2xl text-lg font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-transform">
                      <Plus className="h-6 w-6" />
                      {t('createResume')}
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

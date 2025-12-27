import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { Navbar } from "@/components/layout/Navbar";
import { GridPattern } from "@/components/ui/grid-pattern";
import {
  ArrowRight,
  Bot,
  Download,
  FileText,
  Globe2,
  Layout,
  MonitorSmartphone,
  Shield,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "HomePage" });
  const session = await auth();

  const metrics = [
    { icon: Users, value: "18k+", label: t("metrics.users") },
    { icon: FileText, value: "82k", label: t("metrics.resumes") },
    { icon: Download, value: "210k", label: t("metrics.downloads") },
    { icon: Star, value: "4.9/5", label: t("metrics.satisfaction") },
  ];

  const features = [
    {
      title: t("ribbons.layout.title"),
      desc: t("ribbons.layout.desc"),
      icon: MonitorSmartphone,
      className: "md:col-span-2",
    },
    {
      title: t("ribbons.speed.title"),
      desc: t("ribbons.speed.desc"),
      icon: Zap,
      className: "md:col-span-1",
    },
    {
      title: t("ribbons.ai.title"),
      desc: t("ribbons.ai.desc"),
      icon: Bot,
      className: "md:col-span-1",
    },
    {
      title: t("highlights.ats.title"),
      desc: t("highlights.ats.desc"),
      icon: Shield,
      className: "md:col-span-2",
    },
  ];

  const workflow = [
    {
      icon: Layout,
      title: t("workflow.plan.title"),
      desc: t("workflow.plan.desc"),
    },
    {
      icon: Sparkles,
      title: t("workflow.write.title"),
      desc: t("workflow.write.desc"),
    },
    {
      icon: Globe2,
      title: t("workflow.export.title"),
      desc: t("workflow.export.desc"),
    },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <Navbar user={session?.user} locale={locale} />

      {/* Background Grid */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <GridPattern
          squares={[
            [4, 4],
            [5, 1],
            [8, 2],
            [6, 6],
            [12, 12],
          ]}
          className="[mask-image:radial-gradient(600px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        />
      </div>

      <main className="flex flex-col gap-32 pb-32">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-56 md:pb-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          {/* Animated Glow Effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse opacity-50" />

          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary mb-10 backdrop-blur-md shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2.5 animate-pulse" />
            {t("badge")}
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground to-foreground/60">
            {t("title")} <br className="hidden md:block" />
            <span className="text-primary drop-shadow-sm">{t("subtitle")}</span>
          </h1>

          <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            {t("description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Link href={`/${locale}/editor/new`}>
              <Button size="lg" className="h-14 px-10 text-lg font-bold shadow-2xl shadow-primary/30 hover:scale-105 transition-transform">
                {t("getStarted")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href={`/${locale}/templates`}>
              <Button variant="outline" size="lg" className="h-14 px-10 text-lg font-semibold bg-background/40 backdrop-blur-md border-border/50 hover:bg-background/60 transition-all">
                {t("viewTemplates")}
              </Button>
            </Link>
          </div>

          {/* Metrics Section with improved design */}
          <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto">
            {metrics.map((metric, i) => (
              <div key={i} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors group">
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                  <metric.icon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <div className="text-4xl font-black tracking-tighter text-foreground">{metric.value}</div>
                  <div className="text-sm text-muted-foreground font-bold uppercase tracking-widest">{metric.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid with more impact */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-16">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">{t("workflow.title")}</h2>
            <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              {t("workflow.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <Card key={i} className={`group bg-card/40 backdrop-blur-md border-border/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/40 ${feature.className || ""}`}>
                <CardHeader className="p-8">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold tracking-tight mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-lg leading-relaxed font-medium text-muted-foreground/90">
                    {feature.desc}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Workflow Steps - More dynamic */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-16">
          <div className="rounded-[40px] border border-border/50 bg-secondary/20 p-12 md:p-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 blur-[100px] -z-10" />

            <div className="grid md:grid-cols-3 gap-16 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

              {workflow.map((step, i) => (
                <div key={i} className="relative flex flex-col items-center text-center gap-6 group">
                  <div className="h-32 w-32 rounded-[2rem] bg-background border-2 border-border/50 shadow-2xl flex items-center justify-center z-10 relative transition-all group-hover:scale-110 group-hover:border-primary/50 duration-500">
                    <step.icon className="h-14 w-14 text-primary group-hover:rotate-6 transition-transform duration-500" />
                    <div className="absolute -top-3 -right-3 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-black shadow-xl ring-4 ring-background">
                      {i + 1}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold tracking-tight">{step.title}</h3>
                    <p className="text-muted-foreground text-lg font-medium leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full text-center py-16">
          <div className="relative rounded-[3rem] overflow-hidden p-16 md:p-32 bg-foreground text-background shadow-[0_0_50px_-12px_rgba(0,0,0,0.3)] dark:shadow-[0_0_50px_-12px_rgba(255,255,255,0.1)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--primary),transparent_70%)] opacity-20" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/20 blur-[100px] rounded-full" />

            <div className="relative z-10 space-y-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                {t("ctaSection.title")}
              </h2>
              <p className="text-background/70 text-xl md:text-2xl max-w-2xl mx-auto font-medium">
                {t("ctaSection.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
                <Link href={`/${locale}/auth/signup`}>
                  <Button size="lg" className="h-16 px-12 text-xl font-black bg-primary text-primary-foreground hover:scale-105 transition-transform shadow-2xl shadow-primary/40">
                    {t("ctaSection.primary")}
                  </Button>
                </Link>
                <Link href={`/${locale}/editor/demo`}>
                  <Button size="lg" variant="outline" className="h-16 px-12 text-xl font-bold border-background/20 bg-background/5 text-background hover:bg-background/10 transition-colors">
                    {t("getStarted")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Minimal */}
        <footer className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
              <FileText className="h-3 w-3" />
            </div>
            <span className="font-semibold text-foreground">BestResume</span>
          </div>
          <p> {new Date().getFullYear()} BestResume. {t("footerNote")}</p>
        </footer>
      </main>
    </div>
  );
}

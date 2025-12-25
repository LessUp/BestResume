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
  const t = await getTranslations({locale, namespace: "HomePage"});
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

      <main className="flex flex-col gap-24 pb-24">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
            {t("badge")}
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            {t("title")} <br className="hidden md:block" />
            <span className="text-primary">{t("subtitle")}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            {t("description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href={`/${locale}/editor/new`}>
              <Button size="lg" className="h-12 px-8 text-base font-semibold shadow-lg shadow-primary/20">
                {t("getStarted")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/${locale}/templates`}>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm">
                {t("viewTemplates")}
              </Button>
            </Link>
          </div>

          {/* Social Proof / Metrics */}
          <div className="mt-20 pt-10 border-t border-border/50 grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="text-3xl font-bold tracking-tight">{metric.value}</div>
                <div className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                  <metric.icon className="h-4 w-4" />
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("workflow.title")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("workflow.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className={`bg-card/50 backdrop-blur-sm border-border/50 transition-all duration-300 hover:shadow-lg hover:border-primary/20 ${feature.className || ""}`}>
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Workflow Steps */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
           <div className="rounded-3xl border border-border/50 bg-secondary/30 p-8 md:p-16">
             <div className="grid md:grid-cols-3 gap-12 relative">
               {/* Connector Line (Desktop) */}
               <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent" />
               
               {workflow.map((step, i) => (
                 <div key={i} className="relative flex flex-col items-center text-center gap-4">
                   <div className="h-24 w-24 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center z-10 relative group transition-transform hover:scale-110 duration-300">
                     <step.icon className="h-10 w-10 text-primary group-hover:text-primary/80 transition-colors" />
                     <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-md">
                       {i + 1}
                     </div>
                   </div>
                   <h3 className="text-xl font-bold mt-4">{step.title}</h3>
                   <p className="text-muted-foreground">{step.desc}</p>
                 </div>
               ))}
             </div>
           </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
          <div className="relative rounded-3xl overflow-hidden p-12 md:p-24 bg-primary text-primary-foreground shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]" />
            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                {t("ctaSection.title")}
              </h2>
              <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto">
                {t("ctaSection.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href={`/${locale}/auth/signup`}>
                  <Button size="lg" variant="secondary" className="h-14 px-10 text-base font-bold shadow-xl">
                    {t("ctaSection.primary")}
                  </Button>
                </Link>
                <Link href={`/${locale}/editor/demo`}>
                  <Button size="lg" variant="outline" className="h-14 px-10 text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
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

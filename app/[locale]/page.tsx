"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ClipboardPen,
  Download,
  FileText,
  Flame,
  Globe2,
  Layout,
  Menu,
  MonitorSmartphone,
  MousePointerClick,
  PenTool,
  Shield,
  Sparkles,
  Star,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const t = useTranslations("HomePage");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const metrics = [
    { icon: Users, value: "18k+", label: t("metrics.users") },
    { icon: FileText, value: "82k", label: t("metrics.resumes") },
    { icon: Download, value: "210k", label: t("metrics.downloads") },
    { icon: Star, value: "4.9/5", label: t("metrics.satisfaction") },
  ];

  const ribbons = [
    { title: t("ribbons.layout.title"), desc: t("ribbons.layout.desc"), icon: MonitorSmartphone },
    { title: t("ribbons.speed.title"), desc: t("ribbons.speed.desc"), icon: Zap },
    { title: t("ribbons.ai.title"), desc: t("ribbons.ai.desc"), icon: Bot },
  ];

  const highlights = [
    { icon: Layout, title: t("highlights.blueprint.title"), desc: t("highlights.blueprint.desc"), accent: "from-blue-50" },
    { icon: Shield, title: t("highlights.ats.title"), desc: t("highlights.ats.desc"), accent: "from-emerald-50" },
    { icon: MousePointerClick, title: t("highlights.preview.title"), desc: t("highlights.preview.desc"), accent: "from-indigo-50" },
    { icon: ClipboardPen, title: t("highlights.story.title"), desc: t("highlights.story.desc"), accent: "from-amber-50" },
  ];

  const workflow = [
    {
      icon: Layout,
      label: t("workflow.plan.note"),
      title: t("workflow.plan.title"),
      desc: t("workflow.plan.desc"),
    },
    {
      icon: Sparkles,
      label: t("workflow.write.note"),
      title: t("workflow.write.title"),
      desc: t("workflow.write.desc"),
    },
    {
      icon: Globe2,
      label: t("workflow.export.note"),
      title: t("workflow.export.title"),
      desc: t("workflow.export.desc"),
    },
  ];

  const templates = [
    {
      name: t("templatesSection.modern.label"),
      desc: t("templatesSection.modern.desc"),
      badge: t("templatesSection.modern.badge"),
      accent: "from-blue-500/20 via-blue-500/10 to-indigo-500/20",
    },
    {
      name: t("templatesSection.minimal.label"),
      desc: t("templatesSection.minimal.desc"),
      badge: t("templatesSection.minimal.badge"),
      accent: "from-slate-500/10 via-slate-100 to-slate-50",
    },
    {
      name: t("templatesSection.focus.label"),
      desc: t("templatesSection.focus.desc"),
      badge: t("templatesSection.focus.badge"),
      accent: "from-violet-500/20 via-purple-500/10 to-fuchsia-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-slate-200"
            : "bg-transparent"
        }`}
      >
        <nav ref={navRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href={`/${locale}`} className="flex items-center gap-2.5">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/25">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-slate-900">BestResume</span>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              <LanguageSwitcher />
              <Link href={`/${locale}/auth/signin`}>
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900 font-medium">
                  {t("nav.signIn")}
                </Button>
              </Link>
              <Link href={`/${locale}/auth/signup`}>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/20">
                  {t("nav.startFree")}
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <LanguageSwitcher />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-100 space-y-2 animate-fade-in">
              <Link href={`/${locale}/auth/signin`} className="block" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" className="w-full">
                  {t("nav.signIn")}
                </Button>
              </Link>
              <Link href={`/${locale}/auth/signup`} className="block" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">{t("nav.startFree")}</Button>
              </Link>
            </div>
          )}
        </nav>
      </header>

      <main>
        <section className="relative pt-28 lg:pt-36 pb-16 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white" />
            <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-purple-500/15 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.14),transparent_36%),radial-gradient(circle_at_80%_10%,rgba(129,140,248,0.16),transparent_32%)]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-blue-100 shadow-sm backdrop-blur">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">{t("badge")}</span>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-slate-900">
                    {t("title")} <span className="text-gradient">{t("subtitle")}</span>
                  </h1>
                  <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
                    {t("description")}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href={`/${locale}/editor/demo`}>
                    <Button
                      size="lg"
                      className="w-full sm:w-auto h-14 px-8 text-base font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 shadow-xl shadow-blue-600/20"
                    >
                      {t("getStarted")}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href={`/${locale}/templates`}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto h-14 px-8 text-base font-semibold border-2"
                    >
                      {t("viewTemplates")}
                    </Button>
                  </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {ribbons.map((item) => (
                    <div
                      key={item.title}
                      className="group rounded-2xl border border-slate-100 bg-white/90 shadow-sm p-4 flex gap-3 items-start backdrop-blur"
                    >
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>{t("trust.noCard")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>{t("trust.freeTemplates")}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="bg-white/80 backdrop-blur rounded-2xl border border-slate-100 shadow-sm px-4 py-3 flex items-center gap-3"
                    >
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700">
                        <metric.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-900">{metric.value}</p>
                        <p className="text-xs text-slate-500">{metric.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-8 bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-purple-500/15 rounded-[28px] blur-2xl" />
                <div className="relative rounded-[24px] bg-white border border-slate-100 shadow-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center text-white text-xl font-bold">
                        JD
                      </div>
                      <div className="text-white">
                        <p className="text-base font-semibold">张三</p>
                        <p className="text-sm text-slate-200">高级前端工程师</p>
                        <p className="text-xs text-slate-300">北京 · 5年经验</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-300 text-sm">
                      <Shield className="h-4 w-4" />
                      <span>{t("atsScore.label")}</span>
                      <span className="font-semibold">{t("atsScore.value")}</span>
                    </div>
                  </div>

                  <div className="p-6 space-y-5 bg-gradient-to-b from-white via-slate-50 to-white">
                    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <p className="text-sm font-semibold text-slate-800">{t("preview.responsive")}</p>
                        </div>
                        <span className="text-xs text-slate-500">1920px</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {["65%", "45%", "32%"].map((width) => (
                          <div key={width} className="space-y-2">
                            <div className="h-24 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200" />
                            <div className="h-2.5 bg-slate-200/90 rounded-full" style={{ width }} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-2 w-2 rounded-full bg-emerald-500" />
                          <p className="text-sm font-semibold text-slate-800">{t("preview.skills")}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {["React", "TypeScript", "Next.js", "Tailwind", "GraphQL", "UI Kits"].map((skill) => (
                            <span
                              key={skill}
                              className="px-3 py-1 text-xs font-medium rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-100/70"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-2 w-2 rounded-full bg-purple-500" />
                          <p className="text-sm font-semibold text-slate-800">{t("preview.results")}</p>
                        </div>
                        <div className="space-y-3">
                          {[1, 2, 3].map((item) => (
                            <div key={item} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />
                              <div className="flex-1 space-y-1">
                                <div className="h-2.5 bg-slate-100 rounded-full" />
                                <div className="h-2 bg-slate-100 rounded-full w-4/5" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute right-4 top-4 sm:right-6 sm:top-6 bg-white rounded-2xl border border-slate-100 shadow-lg px-4 py-3 hidden sm:flex items-center gap-3 animate-float">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{t("aiOptimize.label")}</p>
                    <p className="text-sm font-semibold text-emerald-600">{t("aiOptimize.status")}</p>
                  </div>
                </div>

                <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 bg-white rounded-2xl border border-slate-100 shadow-lg px-4 py-3 hidden sm:flex items-center gap-3 animate-float delay-1000">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{t("atsScore.label")}</p>
                    <p className="text-sm font-semibold text-blue-600">{t("atsScore.value")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
              <div className="space-y-4">
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-[0.2em]">{t("desktopFit.badge")}</p>
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                  {t("desktopFit.title")}
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed max-w-2xl">{t("desktopFit.desc")}</p>
                <div className="flex flex-wrap gap-3">
                  {[t("desktopFit.chip1"), t("desktopFit.chip2"), t("desktopFit.chip3")].map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm"
                    >
                      <Flame className="h-4 w-4 text-blue-600" /> {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {highlights.map((item) => (
                  <div
                    key={item.title}
                    className="bg-gradient-to-br from-white via-slate-50 to-white rounded-2xl border border-slate-100 shadow-sm p-5 card-hover"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${item.accent} to-white text-blue-700 flex items-center justify-center border border-slate-200`}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <PenTool className="h-4 w-4 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-12">
              <div>
                <p className="text-sm font-semibold text-blue-200 uppercase tracking-[0.2em]">{t("badge")}</p>
                <h2 className="text-3xl sm:text-4xl font-bold mt-2">{t("workflow.title")}</h2>
                <p className="text-slate-300 text-lg max-w-3xl mt-3">{t("workflow.subtitle")}</p>
              </div>
              <Link href={`/${locale}/editor/demo`}>
                <Button className="bg-white text-slate-900 hover:bg-slate-100 shadow-lg px-6 h-12">
                  {t("getStarted")} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {workflow.map((step, index) => (
                <div
                  key={step.title}
                  className="relative rounded-2xl border border-slate-800 bg-slate-800/60 p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-white/10 text-white flex items-center justify-center">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-300">0{index + 1}</span>
                  </div>
                  <p className="inline-flex px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-200 mb-3">
                    {step.label}
                  </p>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <p className="text-sm font-semibold text-blue-600 uppercase tracking-[0.2em]">{t("templatesSection.label")}</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">{t("templatesSection.title")}</h2>
              <p className="text-slate-600 text-lg mt-3">{t("templatesSection.subtitle")}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div
                  key={template.name}
                  className="relative rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden"
                >
                  <div className={`absolute inset-x-0 h-32 bg-gradient-to-br ${template.accent}`} />
                  <div className="relative p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/70 border border-white/60 backdrop-blur">
                        {template.badge}
                      </span>
                      <div className="h-10 w-10 rounded-xl bg-slate-900/90 text-white flex items-center justify-center">
                        <Layout className="h-5 w-5" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">{template.name}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{template.desc}</p>
                    <Button variant="outline" className="w-full justify-between">
                      {t("viewTemplates")} <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-8 sm:p-12 text-center text-white shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.12),transparent_30%)]" />
              <div className="relative space-y-4">
                <h2 className="text-3xl sm:text-4xl font-bold">{t("ctaSection.title")}</h2>
                <p className="text-white/80 text-lg max-w-2xl mx-auto">{t("ctaSection.subtitle")}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <Link href={`/${locale}/auth/signup`}>
                    <Button size="lg" className="h-14 px-10 text-base font-semibold bg-white text-slate-900 hover:bg-slate-100">
                      {t("ctaSection.primary")}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href={`/${locale}/editor/demo`}>
                    <Button
                      size="lg"
                      variant="ghost"
                      className="h-14 px-10 text-base font-semibold text-white hover:bg-white/10 border border-white/20"
                    >
                      {t("getStarted")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-100 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                <FileText className="h-4 w-4" />
              </div>
              <span className="font-semibold text-slate-900">BestResume</span>
            </div>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} BestResume. {t("footerNote")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { 
  FileText, Sparkles, ArrowRight, CheckCircle2, Layout, Zap, 
  Bot, Star, Users, Download, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Home() {
  const t = useTranslations('HomePage');
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: Layout, title: t('features.ats'), desc: t('features.atsDesc'), color: 'blue' },
    { icon: Bot, title: t('features.ai'), desc: t('features.aiDesc'), color: 'purple' },
    { icon: FileText, title: t('features.templates'), desc: t('features.templatesDesc'), color: 'indigo' },
    { icon: Zap, title: t('features.realtime'), desc: t('features.realtimeDesc'), color: 'amber' },
  ];

  const stats = [
    { icon: Users, value: "10,000+", label: "活跃用户" },
    { icon: FileText, value: "50,000+", label: "简历创建" },
    { icon: Download, value: "100,000+", label: "PDF下载" },
    { icon: Star, value: "4.9/5", label: "用户评分" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'
      }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href={`/${locale}`} className="flex items-center gap-2.5">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/25">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-gray-900">BestResume</span>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              <LanguageSwitcher />
              <Link href={`/${locale}/auth/signin`}>
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900 font-medium">登录</Button>
              </Link>
              <Link href={`/${locale}/auth/signup`}>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/20">
                  免费开始
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <LanguageSwitcher />
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg hover:bg-gray-100">
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100 space-y-2 animate-fade-in">
              <Link href={`/${locale}/auth/signin`} className="block">
                <Button variant="ghost" className="w-full">登录</Button>
              </Link>
              <Link href={`/${locale}/auth/signup`} className="block">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">免费开始</Button>
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 lg:pt-40 pb-20 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-white to-white" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-100/50 to-indigo-100/50 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative rounded-full h-2 w-2 bg-blue-500" />
                </span>
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">{t('badge')}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                <span className="text-gray-900">{t('title')}</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {t('subtitle')}
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                {t('description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link href={`/${locale}/editor/demo`}>
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-600/25">
                    {t('getStarted')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href={`/${locale}/templates`}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-semibold border-2">
                    {t('viewTemplates')}
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>{t('trust.noCard')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>{t('trust.freeTemplates')}</span>
                </div>
              </div>
            </div>

            {/* Resume Preview Card */}
            <div className="relative lg:pl-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl scale-110" />
              
              <div className="relative bg-white rounded-2xl shadow-2xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">JD</span>
                    </div>
                    <div className="text-white">
                      <h3 className="text-lg font-bold">张三</h3>
                      <p className="text-blue-100 text-sm">高级前端工程师</p>
                      <p className="text-blue-200 text-xs mt-0.5">北京 · 5年经验</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      工作经验
                    </div>
                    <div className="space-y-2 pl-3 border-l-2 border-blue-100">
                      <div className="h-2.5 bg-gray-100 rounded-full w-full" />
                      <div className="h-2.5 bg-gray-100 rounded-full w-4/5" />
                      <div className="h-2.5 bg-gray-100 rounded-full w-3/5" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                      技能专长
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'TypeScript', 'Next.js', 'Tailwind'].map((skill) => (
                        <span key={skill} className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-100/50">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-white p-3 rounded-xl shadow-lg border border-gray-100 animate-float">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('atsScore.label')}</p>
                    <p className="text-lg font-bold text-gray-900">{t('atsScore.value')}</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white p-3 rounded-xl shadow-lg border border-gray-100 animate-float delay-1000">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('aiOptimize.label')}</p>
                    <p className="text-sm font-bold text-green-600">{t('aiOptimize.status')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 lg:p-12 shadow-2xl shadow-blue-600/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center text-white">
                  <div className="flex justify-center mb-3">
                    <stat.icon className="h-6 w-6 opacity-80" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-blue-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">功能特性</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">为什么选择 BestResume？</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">专业的简历制作工具，助您轻松创建令人印象深刻的简历</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const colorMap: Record<string, string> = {
                blue: 'bg-blue-100 text-blue-600',
                purple: 'bg-purple-100 text-purple-600',
                indigo: 'bg-indigo-100 text-indigo-600',
                amber: 'bg-amber-100 text-amber-600',
              };
              return (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-300 group">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${colorMap[feature.color]}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl" />
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl px-8 py-16 lg:px-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">准备好创建您的简历了吗？</h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">免费开始使用，无需信用卡。数分钟内创建专业简历。</p>
              <Link href={`/${locale}/auth/signup`}>
                <Button size="lg" className="h-14 px-10 text-base font-semibold bg-white text-gray-900 hover:bg-gray-100 shadow-xl">
                  立即免费开始
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                <FileText className="h-4 w-4" />
              </div>
              <span className="font-semibold text-gray-900">BestResume</span>
            </div>
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} BestResume. {t('footerNote')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

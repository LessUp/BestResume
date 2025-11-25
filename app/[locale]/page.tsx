"use client";

import Link from "next/link";
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { FileText, Sparkles, ArrowRight, CheckCircle2, Layout, Zap, Bot, Star, Users, Download, Shield, Menu, X } from "lucide-react";
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 via-white to-blue-50/30 text-gray-900 overflow-x-hidden">
      
      {/* Modern Glass Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-3 group">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/25 group-hover:shadow-blue-600/40 transition-shadow">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">BestResume</span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <div className="hidden sm:flex items-center gap-3">
              <Link href={`/${locale}/auth/signin`}>
                <Button variant="ghost" className="font-medium">登录</Button>
              </Link>
              <Link href={`/${locale}/auth/signup`}>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/25">免费开始</Button>
              </Link>
            </div>
            <button className="sm:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white border-t border-gray-100 shadow-xl p-4 space-y-3 animate-fade-in">
            <Link href={`/${locale}/auth/signin`} className="block"><Button variant="outline" className="w-full">登录</Button></Link>
            <Link href={`/${locale}/auth/signup`} className="block"><Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">免费开始</Button></Link>
          </div>
        )}
      </header>

      <main className="flex-1 pt-28 lg:pt-36 pb-16 lg:pb-20">
        {/* Background Decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-40 left-1/3 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24 lg:mb-32">
            
            {/* Left Column: Content */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/50 px-4 py-2 text-sm font-medium text-blue-700 animate-fade-in-up shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <Sparkles className="h-4 w-4" />
                {t('badge')}
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.1]">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  {t('title')}
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {t('subtitle')}
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl">
                {t('description')}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 pt-4">
                <Link href={`/${locale}/editor/demo`} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full h-14 px-8 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-[1.02] transition-all duration-300">
                    {t('getStarted')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href={`/${locale}/templates`} className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full h-14 px-8 text-lg font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300">
                    {t('viewTemplates')}
                  </Button>
                </Link>
              </div>

              {/* Trust/Stats text */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>{t('trust.noCard')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>{t('trust.freeTemplates')}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Mockup */}
            <div className="relative max-w-lg mx-auto lg:mx-0">
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-60" />
              
              {/* Resume Card */}
              <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 transform hover:scale-[1.02] transition-all duration-500">
                {/* Header */}
                <div className="flex items-start gap-5 pb-6 border-b border-gray-100">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <span className="text-3xl font-bold text-blue-600">JD</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">张三</h3>
                    <p className="text-blue-600 font-medium">高级前端工程师</p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                      <span>北京</span>
                      <span>•</span>
                      <span>5年经验</span>
                    </div>
                  </div>
                </div>

                {/* Content Preview */}
                <div className="space-y-5 pt-6">
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
                      {['React', 'TypeScript', 'Next.js', 'Tailwind'].map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-100/50">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-xl border border-gray-100 animate-float">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('atsScore.label')}</p>
                    <p className="text-xl font-bold text-gray-900">{t('atsScore.value')}</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-xl border border-gray-100 animate-float animation-delay-2000">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{t('aiOptimize.label')}</p>
                    <p className="text-sm font-bold text-green-600">{t('aiOptimize.status')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mb-24 lg:mb-32 py-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCard icon={<Users className="h-6 w-6" />} value="10,000+" label="活跃用户" />
              <StatCard icon={<FileText className="h-6 w-6" />} value="50,000+" label="简历创建" />
              <StatCard icon={<Download className="h-6 w-6" />} value="100,000+" label="PDF下载" />
              <StatCard icon={<Star className="h-6 w-6" />} value="4.9/5" label="用户评分" />
            </div>
          </div>

          {/* Features Grid */}
          <div className="text-center mb-12">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">功能特性</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4">为什么选择 BestResume？</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             <FeatureCard 
               icon={<Layout className="h-6 w-6" />}
               title={t('features.ats')}
               desc={t('features.atsDesc')}
               color="blue"
             />
             <FeatureCard 
               icon={<Bot className="h-6 w-6" />}
               title={t('features.ai')}
               desc={t('features.aiDesc')}
               color="purple"
             />
             <FeatureCard 
               icon={<FileText className="h-6 w-6" />}
               title={t('features.templates')}
               desc={t('features.templatesDesc')}
               color="indigo"
             />
             <FeatureCard 
               icon={<Zap className="h-6 w-6" />}
               title={t('features.realtime')}
               desc={t('features.realtimeDesc')}
               color="amber"
             />
          </div>

          {/* CTA Section */}
          <div className="mt-24 lg:mt-32 text-center">
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl px-8 py-16 sm:px-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  准备好创建您的简历了吗？
                </h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  免费开始使用，无需信用卡。数分钟内创建专业简历。
                </p>
                <Link href={`/${locale}/auth/signup`}>
                  <Button size="lg" className="h-14 px-10 text-lg font-semibold rounded-xl bg-white text-gray-900 hover:bg-gray-100 shadow-xl">
                    立即免费开始
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="border-t border-gray-200 py-12 bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white">
                <FileText className="h-4 w-4" />
              </div>
              <span className="font-bold text-gray-900">BestResume</span>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} BestResume. {t('footerNote')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Stats Card Component
function StatCard({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  return (
    <div className="text-center text-white">
      <div className="flex justify-center mb-3 opacity-80">{icon}</div>
      <div className="text-3xl sm:text-4xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-80">{label}</div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
    purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100',
    indigo: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100',
    amber: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100',
  };
  
  return (
    <div className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 group cursor-pointer">
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${colorClasses[color]}`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">{desc}</p>
    </div>
  );
}

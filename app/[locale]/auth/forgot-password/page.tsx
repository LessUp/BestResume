"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLocale, useTranslations } from 'next-intl';
import { requestPasswordReset } from "@/app/actions/auth";
import { FileText, ArrowLeft, Mail, CheckCircle2, X } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const locale = useLocale();
  const t = useTranslations('Auth');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      await requestPasswordReset(email, locale);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('resetFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)]" />
        <div className="relative z-10 p-12 text-primary-foreground max-w-lg">
          <Link href={`/${locale}`} className="flex items-center gap-3 mb-12">
            <div className="h-10 w-10 bg-primary-foreground/10 backdrop-blur rounded-lg flex items-center justify-center border border-primary-foreground/20">
              <FileText className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold">BestResume</span>
          </Link>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {t('forgotPassword')}
              </h1>
              <p className="text-xl text-primary-foreground/80 leading-relaxed">
                {t('forgotPasswordDesc')}
              </p>
            </div>
          </div>

          <p className="text-primary-foreground/60 text-sm mt-auto pt-12">
            &copy; {new Date().getFullYear()} BestResume. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden">
            <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>{t('backToHome')}</span>
            </Link>
          </div>

          {sent ? (
            <div className="text-center space-y-6">
              <div className="mx-auto h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {t('checkEmail')}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {t('resetEmailSent')} <strong>{email}</strong>
                </p>
              </div>
              <Link href={`/${locale}/auth/signin`}>
                <Button variant="outline" className="w-full h-12">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('backToSignIn')}
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-foreground tracking-tight">
                  {t('forgotPassword')}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {t('forgotPasswordDesc')}
                </p>
              </div>

              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm flex items-start gap-3">
                  <X className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 pl-10"
                      placeholder={t('emailPlaceholder')}
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 text-base font-semibold shadow-sm"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      {t('sending')}
                    </span>
                  ) : (
                    t('sendResetLink')
                  )}
                </Button>
              </form>

              <div className="text-center">
                <Link 
                  href={`/${locale}/auth/signin`}
                  className="text-sm text-primary hover:underline flex items-center justify-center gap-2 font-medium"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t('backToSignIn')}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

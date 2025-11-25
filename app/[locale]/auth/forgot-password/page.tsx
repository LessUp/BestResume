"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLocale, useTranslations } from 'next-intl';
import { requestPasswordReset } from "@/app/actions/auth";
import { FileText, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

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
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('resetFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Link href={`/${locale}`} className="flex items-center gap-2 text-gray-900 dark:text-white mb-8">
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <FileText className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold">BestResume</span>
          </Link>
        </div>

        {sent ? (
          <div className="text-center space-y-6">
            <div className="mx-auto h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('checkEmail')}
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
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
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {t('forgotPassword')}
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {t('forgotPasswordDesc')}
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email">{t('email')}</Label>
                <div className="relative mt-1">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-10"
                    placeholder={t('emailPlaceholder')}
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-base font-semibold"
              >
                {loading ? t('sending') : t('sendResetLink')}
              </Button>
            </form>

            <div className="text-center">
              <Link 
                href={`/${locale}/auth/signin`}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('backToSignIn')}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

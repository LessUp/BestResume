"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from 'next-intl';
import { FileText, CheckCircle2, X, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { verifyEmail } from "@/app/actions/auth";

export default function VerifyEmail() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const locale = useLocale();
  const t = useTranslations('Auth');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError(t('invalidVerificationLink'));
        setLoading(false);
        return;
      }

      try {
        await verifyEmail(token, locale);
        setSuccess(true);
        setLoading(false);
      } catch (err: any) {
        // LocalizedError already has the localized message
        setError(err instanceof Error ? err.message : t('emailVerifyFailed'));
        setLoading(false);
      }
    };

    verify();
  }, [token, locale, t]);

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
                {t('verifyYourEmail')}
              </h1>
              <p className="text-xl text-primary-foreground/80 leading-relaxed">
                {t('verifyEmailDesc')}
              </p>
            </div>
          </div>

          <p className="text-primary-foreground/60 text-sm mt-auto pt-12">
            &copy; {new Date().getFullYear()} BestResume. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Status */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden">
            <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>{t('backToHome')}</span>
            </Link>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">{t('emailVerification')}</h2>
          </div>

          {loading && (
            <div className="p-8 bg-card border border-border rounded-xl text-center space-y-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
              <p className="text-muted-foreground">{t('verifyingEmail')}</p>
            </div>
          )}

          {success && (
            <div className="space-y-6">
              <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-green-700 dark:text-green-400 flex flex-col items-center gap-4 text-center">
                <CheckCircle2 className="h-16 w-16" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t('emailVerifiedTitle')}
                  </h3>
                  <p className="text-sm">
                    {t('emailVerifiedDesc')}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => router.push(`/${locale}/auth/signin`)}
                className="w-full h-11 text-base shadow-sm"
                size="lg"
              >
                {t('goToSignIn')}
              </Button>
            </div>
          )}

          {error && (
            <div className="space-y-6">
              <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive flex flex-col items-center gap-4 text-center">
                <X className="h-16 w-16" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {t('emailVerifyFailedTitle')}
                  </h3>
                  <p className="text-sm">{error}</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => router.push(`/${locale}/auth/signin`)}
                  className="w-full h-11 text-base shadow-sm"
                  size="lg"
                >
                  {t('goToSignIn')}
                </Button>
                <Button
                  onClick={() => router.push(`/${locale}`)}
                  variant="outline"
                  className="w-full h-11 text-base"
                >
                  {t('backToHome')}
                </Button>
              </div>
            </div>
          )}

          {!token && !loading && (
            <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-700 dark:text-yellow-400 flex flex-col items-center gap-4 text-center">
              <AlertCircle className="h-16 w-16" />
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {t('noVerificationToken')}
                </h3>
                <p className="text-sm">
                  {t('noVerificationTokenDesc')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

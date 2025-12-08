"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLocale, useTranslations } from 'next-intl';
import { FileText, CheckCircle2, X, AlertCircle, Loader2 } from "lucide-react";
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
        setError(t('invalidVerificationLink') || "Invalid verification link");
        setLoading(false);
        return;
      }

      try {
        await verifyEmail(token);
        setSuccess(true);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || t('verificationFailed') || "Failed to verify email");
        setLoading(false);
      }
    };

    verify();
  }, [token, t]);

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href={`/${locale}`} className="flex items-center gap-3 text-white">
            <div className="h-11 w-11 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <FileText className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold">BestResume</span>
          </Link>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                {t('verifyYourEmail') || "Verify Your Email"}
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                {t('verifyEmailDesc') || "Confirm your email address to activate your account"}
              </p>
            </div>
          </div>

          <p className="text-blue-200 text-sm">
            © {new Date().getFullYear()} BestResume. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Status */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">{t('emailVerification') || "Email Verification"}</h2>
          </div>

          {loading && (
            <div className="p-8 bg-white border border-gray-200 rounded-xl text-center space-y-4">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto" />
              <p className="text-gray-600">{t('verifying') || "Verifying your email..."}</p>
            </div>
          )}

          {success && (
            <div className="space-y-6">
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-green-700 flex flex-col items-center gap-4">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    {t('emailVerified') || "Email Verified!"}
                  </h3>
                  <p className="text-sm">
                    {t('emailVerifiedDesc') || "Your email has been successfully verified. You can now sign in to your account."}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => router.push(`/${locale}/auth/signin`)}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/25"
              >
                {t('goToSignIn') || "Go to Sign In"}
              </Button>
            </div>
          )}

          {error && (
            <div className="space-y-6">
              <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-600 flex flex-col items-center gap-4">
                <X className="h-16 w-16" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    {t('verificationFailed') || "Verification Failed"}
                  </h3>
                  <p className="text-sm">{error}</p>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => router.push(`/${locale}/auth/signin`)}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/25"
                >
                  {t('goToSignIn') || "Go to Sign In"}
                </Button>
                <Button
                  onClick={() => router.push(`/${locale}`)}
                  variant="outline"
                  className="w-full h-12 text-base font-semibold"
                >
                  {t('backToHome') || "Back to Home"}
                </Button>
              </div>
            </div>
          )}

          {!token && !loading && (
            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 flex flex-col items-center gap-4">
              <AlertCircle className="h-16 w-16" />
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">
                  {t('noVerificationToken') || "No Verification Token"}
                </h3>
                <p className="text-sm">
                  {t('noVerificationTokenDesc') || "No verification token provided. Please use the link from your email."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

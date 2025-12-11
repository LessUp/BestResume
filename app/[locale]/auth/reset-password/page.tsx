"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLocale, useTranslations } from 'next-intl';
import { FileText, Eye, EyeOff, ArrowLeft, CheckCircle2, X, AlertCircle } from "lucide-react";
import { resetPassword } from "@/app/actions/auth";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const locale = useLocale();
  const t = useTranslations('Auth');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError(t('invalidResetLink') || "Invalid reset link");
    }
  }, [token, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError(t('invalidResetLink') || "Invalid reset link");
      return;
    }

    if (newPassword.length < 8) {
      setError(t('passwordTooShort') || "Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('passwordsDoNotMatch') || "Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({ token, newPassword }, locale);
      setSuccess(true);
      setTimeout(() => {
        router.push(`/${locale}/auth/signin`);
      }, 2000);
    } catch (err: any) {
      // LocalizedError already has the localized message
      setError(err.message || t('resetFailed') || "Failed to reset password");
      setLoading(false);
    }
  };

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
                {t('resetYourPassword') || "Reset Your Password"}
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                {t('resetPasswordDesc') || "Choose a new password for your account"}
              </p>
            </div>
          </div>

          <p className="text-blue-200 text-sm">
            © {new Date().getFullYear()} BestResume. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden">
            <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>{t('backToHome') || "Back to Home"}</span>
            </Link>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">{t('resetPassword') || "Reset Password"}</h2>
            <p className="mt-3 text-gray-600">
              {t('enterNewPassword') || "Enter your new password below"}
            </p>
          </div>

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-start gap-3 animate-fade-in">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-green-600" />
              <span>{t('passwordResetSuccess') || "Password reset successful! Redirecting to sign in..."}</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-3">
              <X className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {!token && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{t('noResetToken') || "No reset token provided. Please use the link from your email."}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="newPassword" className="text-gray-700 font-medium">
                  {t('newPassword') || "New Password"}
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-12 pr-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder={t('passwordPlaceholder') || "Enter your password"}
                    disabled={!token || success}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                  {t('confirmPassword') || "Confirm Password"}
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 pr-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder={t('confirmPasswordPlaceholder') || "Confirm your password"}
                    disabled={!token || success}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !token || success}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/25 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('resetting') || "Resetting..."}
                </span>
              ) : (
                t('resetPassword') || "Reset Password"
              )}
            </Button>
          </form>

          <div className="text-center">
            <Link href={`/${locale}/auth/signin`} className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
              {t('backToSignIn') || "Back to Sign In"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

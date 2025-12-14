"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLocale, useTranslations } from 'next-intl';
import { registerUser } from "@/app/actions/auth";
import { FileText, Eye, EyeOff, Check, X, ArrowLeft, Sparkles, Users, Shield, Zap } from "lucide-react";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('Auth');

  const passwordChecks = {
    length: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasLetter: /[a-zA-Z]/.test(password),
    match: password === confirmPassword && password.length > 0,
  };

  const isPasswordStrong = passwordChecks.length && passwordChecks.hasNumber && passwordChecks.hasLetter;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isPasswordStrong) {
      setError(t('passwordWeak'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }

    setLoading(true);
    try {
      await registerUser({ email, password, name }, locale);
      router.push(`/${locale}/auth/signin?registered=true`);
    } catch (err) {
      // LocalizedError already has the localized message
      setError(err instanceof Error ? err.message : t('registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const PasswordCheck = ({ passed, text }: { passed: boolean; text: string }) => (
    <div className={`flex items-center gap-2 text-sm transition-colors ${passed ? 'text-green-600' : 'text-gray-400'}`}>
      {passed ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
      <span>{text}</span>
    </div>
  );

  const features = [
    { icon: Shield, text: t('signupFeatureAts') },
    { icon: Sparkles, text: t('signupFeatureAI') },
    { icon: Zap, text: t('signupFeatureExportPdf') },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3 text-white">
            <div className="h-11 w-11 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <FileText className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold">BestResume</span>
          </Link>

          {/* Main Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                {t('signupHeroTitle')}
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed">
                {t('signupHeroDesc')}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-white/90">
                  <div className="h-10 w-10 rounded-lg bg-white/10 backdrop-blur flex items-center justify-center">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <span className="text-lg">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full bg-gradient-to-br from-white/30 to-white/10 border-2 border-white/30" />
                ))}
              </div>
              <div className="text-blue-100">
                <span className="font-semibold text-white">10,000+</span> {t('trustedBy')}
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-blue-200 text-sm">
            © {new Date().getFullYear()} BestResume. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Back Link */}
          <div className="lg:hidden">
            <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>{t('backToHome')}</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">{t('createAccount')}</h2>
            <p className="mt-3 text-gray-600">
              {t('alreadyHaveAccount')}{" "}
              <Link href={`/${locale}/auth/signin`} className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                {t('signIn')}
              </Link>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-3">
              <X className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-700 font-medium">{t('name')}</Label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder={t('namePlaceholder')}
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder={t('emailPlaceholder')}
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700 font-medium">{t('password')}</Label>
                <div className="relative mt-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pr-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    placeholder={t('passwordPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {password && (
                  <div className="mt-3 p-4 bg-white rounded-xl border border-gray-100 space-y-2">
                    <PasswordCheck passed={passwordChecks.length} text={t('passwordLength')} />
                    <PasswordCheck passed={passwordChecks.hasLetter} text={t('passwordLetter')} />
                    <PasswordCheck passed={passwordChecks.hasNumber} text={t('passwordNumber')} />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">{t('confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-2 h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  placeholder={t('confirmPasswordPlaceholder')}
                />
                {confirmPassword && !passwordChecks.match && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <X className="h-4 w-4" />
                    {t('passwordMismatch')}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !isPasswordStrong || !passwordChecks.match}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('creating')}
                </span>
              ) : (
                t('createAccount')
              )}
            </Button>

            <p className="text-xs text-center text-gray-500 leading-relaxed">
              {t('agreeToTerms')}{" "}
              <Link href="#" className="text-blue-600 hover:underline">{t('termsOfService')}</Link>
              {" "}{t('and')}{" "}
              <Link href="#" className="text-blue-600 hover:underline">{t('privacyPolicy')}</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

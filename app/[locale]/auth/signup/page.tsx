"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLocale, useTranslations } from 'next-intl';
import { registerUser } from "@/app/actions/auth";
import { FileText, Eye, EyeOff, ArrowLeft, Check, X, Shield, Sparkles, Zap } from "lucide-react";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const locale = useLocale();
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
      setError(err instanceof Error ? err.message : t('registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const PasswordCheck = ({ passed, text }: { passed: boolean; text: string }) => (
    <div className={`flex items-center gap-2 text-sm transition-colors ${passed ? 'text-green-600' : 'text-muted-foreground'}`}>
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
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_70%)]" />
        <div className="relative z-10 p-12 text-primary-foreground max-w-lg">
          <Link href={`/${locale}`} className="flex items-center gap-3 mb-12">
            <div className="h-10 w-10 bg-primary-foreground/10 backdrop-blur rounded-lg flex items-center justify-center border border-primary-foreground/20">
              <FileText className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold">BestResume</span>
          </Link>

          <h1 className="text-4xl font-bold mb-6 leading-tight">
            {t('signupHeroTitle')}
          </h1>
          <p className="text-primary-foreground/80 text-lg mb-12 leading-relaxed">
            {t('signupHeroDesc')}
          </p>

          <div className="space-y-6">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary-foreground/10 flex items-center justify-center border border-primary-foreground/10">
                  <feature.icon className="h-5 w-5" />
                </div>
                <span className="text-lg font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-muted/30">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Back Link */}
          <div className="lg:hidden">
            <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">{t('backToHome')}</span>
            </Link>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">{t('createAccount')}</h2>
            <p className="mt-2 text-muted-foreground">
              {t('alreadyHaveAccount')}{" "}
              <Link href={`/${locale}/auth/signin`} className="text-primary hover:underline font-medium">
                {t('signIn')}
              </Link>
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm flex items-start gap-3">
              <X className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('name')}</Label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11"
                  placeholder={t('namePlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                  placeholder={t('emailPlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10"
                    placeholder={t('passwordPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {password && (
                  <div className="p-4 bg-background rounded-lg border border-input space-y-2">
                    <PasswordCheck passed={passwordChecks.length} text={t('passwordLength')} />
                    <PasswordCheck passed={passwordChecks.hasLetter} text={t('passwordLetter')} />
                    <PasswordCheck passed={passwordChecks.hasNumber} text={t('passwordNumber')} />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11"
                  placeholder={t('confirmPasswordPlaceholder')}
                />
                {confirmPassword && !passwordChecks.match && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <X className="h-4 w-4" />
                    {t('passwordMismatch')}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !isPasswordStrong || !passwordChecks.match}
              className="w-full h-11 text-base shadow-sm"
              size="lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  {t('creating')}
                </span>
              ) : (
                t('createAccount')
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground leading-relaxed">
              {t('agreeToTerms')}{" "}
              <Link href="#" className="text-primary hover:underline">{t('termsOfService')}</Link>
              {" "}{t('and')}{" "}
              <Link href="#" className="text-primary hover:underline">{t('privacyPolicy')}</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

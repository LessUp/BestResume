"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useLocale, useTranslations } from 'next-intl';
import { registerUser } from "@/app/actions/auth";
import { FileText, Eye, EyeOff, Check, X, ArrowLeft } from "lucide-react";

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

  // 密码强度检查
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
      await registerUser({ email, password, name });
      router.push(`/${locale}/auth/signin?registered=true`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('registrationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const PasswordCheck = ({ passed, text }: { passed: boolean; text: string }) => (
    <div className={`flex items-center gap-2 text-sm ${passed ? 'text-green-600' : 'text-gray-400'}`}>
      {passed ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
      {text}
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* 左侧品牌区域 */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex-col justify-between">
        <div>
          <Link href={`/${locale}`} className="flex items-center gap-2 text-white">
            <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold">BestResume</span>
          </Link>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-white leading-tight">
            {t('signupHeroTitle')}
          </h1>
          <p className="text-xl text-blue-100">
            {t('signupHeroDesc')}
          </p>
          <div className="flex items-center gap-4 text-blue-100">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-10 rounded-full bg-white/20 border-2 border-blue-600" />
              ))}
            </div>
            <span>{t('trustedBy')}</span>
          </div>
        </div>
        
        <p className="text-blue-200 text-sm">
          © {new Date().getFullYear()} BestResume. All rights reserved.
        </p>
      </div>

      {/* 右侧表单区域 */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden">
            <Link href={`/${locale}`} className="flex items-center gap-2 text-gray-900 mb-8">
              <ArrowLeft className="h-5 w-5" />
              {t('backToHome')}
            </Link>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {t('createAccount')}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {t('alreadyHaveAccount')}{" "}
              <Link href={`/${locale}/auth/signin`} className="text-blue-600 hover:text-blue-700 font-medium">
                {t('signIn')}
              </Link>
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{t('name')}</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 h-12"
                  placeholder={t('namePlaceholder')}
                />
              </div>
              
              <div>
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 h-12"
                  placeholder={t('emailPlaceholder')}
                />
              </div>
              
              <div>
                <Label htmlFor="password">{t('password')}</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pr-10"
                    placeholder={t('passwordPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                
                {/* 密码强度指示 */}
                {password && (
                  <div className="mt-3 space-y-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <PasswordCheck passed={passwordChecks.length} text={t('passwordLength')} />
                    <PasswordCheck passed={passwordChecks.hasLetter} text={t('passwordLetter')} />
                    <PasswordCheck passed={passwordChecks.hasNumber} text={t('passwordNumber')} />
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 h-12"
                  placeholder={t('confirmPasswordPlaceholder')}
                />
                {confirmPassword && !passwordChecks.match && (
                  <p className="mt-2 text-sm text-red-600">{t('passwordMismatch')}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !isPasswordStrong || !passwordChecks.match}
              className="w-full h-12 text-base font-semibold"
            >
              {loading ? t('creating') : t('createAccount')}
            </Button>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
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

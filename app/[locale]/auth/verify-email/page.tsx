"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/app/actions/auth";
import { FileText, CheckCircle2, X, ArrowLeft } from "lucide-react";

export default function VerifyEmail() {
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [error, setError] = useState(""
  );

  const locale = useLocale();
  const t = useTranslations("Auth");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setStatus("error");
        setError(t("emailVerifyFailed"));
        return;
      }
      try {
        await verifyEmail(token);
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : t("emailVerifyFailed"));
      }
    };
    run();
  }, [token, t]);

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

        {status === "verifying" && (
          <div className="text-center space-y-4">
            <div className="mx-auto h-16 w-16 rounded-full border-4 border-blue-100 flex items-center justify-center">
              <span className="h-6 w-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("verifyingEmail")}
            </h2>
          </div>
        )}

        {status === "success" && (
          <div className="text-center space-y-6">
            <div className="mx-auto h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("emailVerifiedTitle")}
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {t("emailVerifiedDesc")}
              </p>
            </div>
            <Link href={`/${locale}/auth/signin`}>
              <Button className="w-full h-12">
                {t("backToSignIn")}
              </Button>
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="text-center space-y-6">
            <div className="mx-auto h-16 w-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("emailVerifyFailed")}
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {error}
              </p>
            </div>
            <Link href={`/${locale}/auth/signin`}>
              <Button variant="outline" className="w-full h-12 flex items-center justify-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t("backToSignIn")}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

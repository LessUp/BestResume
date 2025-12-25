'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations('Common');
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    if (locale === newLocale) return;
    
    // Construct new path
    let newPath;
    if (pathname.startsWith(`/${locale}`)) {
        newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    } else {
        if (pathname === '/') {
            newPath = `/${newLocale}`;
        } else {
            newPath = `/${newLocale}${pathname}`;
        }
    }
    
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground hidden sm:inline">
        {t('language')}
      </span>
      <div className="flex items-center bg-muted rounded-full p-1 border border-border shadow-sm">
        <button
            onClick={() => switchLanguage('zh')}
            className={cn(
                "px-3 py-1 rounded-full text-sm font-medium transition-all duration-200",
                locale === 'zh' 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
            )}
        >
            {t('langZh')}
        </button>
        <button
            onClick={() => switchLanguage('en')}
            className={cn(
                "px-3 py-1 rounded-full text-sm font-medium transition-all duration-200",
                locale === 'en' 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
            )}
        >
            {t('langEn')}
        </button>
      </div>
    </div>
  );
}

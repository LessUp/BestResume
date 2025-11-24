'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";

export default function LanguageSwitcher() {
  const locale = useLocale();
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
    <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200 shadow-sm">
        <button
            onClick={() => switchLanguage('zh')}
            className={cn(
                "px-3 py-1 rounded-full text-sm font-medium transition-all duration-200",
                locale === 'zh' 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-500 hover:text-gray-900"
            )}
        >
            中文
        </button>
        <button
            onClick={() => switchLanguage('en')}
            className={cn(
                "px-3 py-1 rounded-full text-sm font-medium transition-all duration-200",
                locale === 'en' 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-500 hover:text-gray-900"
            )}
        >
            EN
        </button>
    </div>
  );
}

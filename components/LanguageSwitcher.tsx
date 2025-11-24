'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const newLocale = locale === 'en' ? 'zh' : 'en';
    
    // Construct new path
    // If pathname starts with /en or /zh, replace it
    let newPath;
    if (pathname.startsWith(`/${locale}`)) {
        newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    } else {
        // Path doesn't contain locale (e.g. if default locale is hidden, though my middleware matches all)
        // Or if we are at root /
        if (pathname === '/') {
            newPath = `/${newLocale}`;
        } else {
            newPath = `/${newLocale}${pathname}`;
        }
    }
    
    router.push(newPath);
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleLanguage} title={locale === 'en' ? 'Switch to Chinese' : '切换到英文'}>
        <Languages className="h-5 w-5" />
        <span className="sr-only">Switch Language</span>
    </Button>
  );
}

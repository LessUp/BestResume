import { getTranslations } from 'next-intl/server';
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const t = await getTranslations('Settings');
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
            <p className="text-gray-500 mt-1">{t('subtitle')}</p>
          </div>
          <LanguageSwitcher />
        </header>

        <Card>
          <CardHeader>
            <CardTitle>{t('languageSectionTitle')}</CardTitle>
            <CardDescription>{t('languageSectionDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                <p>{t('languageHint')}</p>
              </div>
              <LanguageSwitcher />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

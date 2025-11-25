import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCurrentUser } from "@/app/actions/user";
import { getTranslations } from 'next-intl/server';
import { SettingsClient } from "@/components/settings/SettingsClient";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();
  const { locale } = await params;

  if (!session?.user) {
    redirect(`/${locale}/auth/signin`);
  }

  const user = await getCurrentUser();
  const t = await getTranslations('Settings');

  return <SettingsClient user={user} locale={locale} />;
}

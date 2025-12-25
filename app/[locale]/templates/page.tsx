import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutTemplate, Sparkles } from "lucide-react";

const templates = [
  {
    id: "standard",
    nameKey: "standardName",
    descKey: "standardDesc",
  },
  {
    id: "modern",
    nameKey: "modernName",
    descKey: "modernDesc",
  },
  {
    id: "minimal",
    nameKey: "minimalName",
    descKey: "minimalDesc",
  },
];

export default async function TemplatesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: "Templates"});
  const session = await auth();

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar user={session?.user} locale={locale} />
      
      <div className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <header className="mb-10 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <LayoutTemplate className="h-7 w-7 text-primary" />
                {t("title")}
              </h1>
              <p className="mt-2 text-muted-foreground text-sm md:text-base">{t("subtitle")}</p>
            </div>
            <Link href={`/${locale}/editor/demo`}>
              <Button variant="outline" className="gap-2 bg-background">
                <Sparkles className="h-4 w-4" />
                {t("tryDemo")}
              </Button>
            </Link>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map((tpl) => (
              <Card key={tpl.id} className="flex flex-col border border-border hover:border-primary/50 hover:shadow-md transition-all bg-card">
                <CardHeader>
                  <CardTitle>{t(tpl.nameKey)}</CardTitle>
                  <CardDescription>{t(tpl.descKey)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-40 rounded-md border border-border bg-muted/50 flex items-center justify-center text-xs text-muted-foreground">
                    {t("previewPlaceholder")}
                  </div>
                </CardContent>
                <CardFooter className="mt-auto flex justify-end">
                  <Link href={`/${locale}/editor/new?template=${tpl.id}`}>
                    <Button size="sm">{t("useTemplate")}</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

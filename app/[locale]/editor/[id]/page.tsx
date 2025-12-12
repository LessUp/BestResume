import { auth } from "@/auth";
import { getResume } from "@/app/actions";
import EditorClient from "./EditorClient";
import { ResumeData } from "@/types/resume";

interface EditorPageProps {
  params: Promise<{ locale: string; id: string }>;
  searchParams?: Promise<{ template?: string }>;
}

export default async function EditorPage({ params, searchParams }: EditorPageProps) {
  const session = await auth();
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  let initialData: ResumeData | undefined = undefined;
  const initialTemplateId = typeof resolvedSearchParams?.template === 'string' ? resolvedSearchParams.template : undefined;

  if (resolvedParams.id !== 'new' && resolvedParams.id !== 'demo') {
    const resume = await getResume(resolvedParams.id);
    if (resume) {
      initialData = resume.data;
    }
  }

  return (
    <EditorClient
      initialData={initialData}
      resumeId={resolvedParams.id}
      userId={session?.user?.id}
      locale={resolvedParams.locale}
      initialTemplateId={initialTemplateId}
    />
  );
}

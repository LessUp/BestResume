import { auth } from "@/auth";
import { getResume } from "@/app/actions";
import EditorClient from "./EditorClient";
import { ResumeData } from "@/types/resume";

interface EditorPageProps {
  params: { locale: string; id: string };
  searchParams?: { template?: string | string[] };
}

export default async function EditorPage({ params, searchParams }: EditorPageProps) {
  const session = await auth();

  let initialData: ResumeData | undefined = undefined;
  const initialTemplateId = typeof searchParams?.template === 'string' ? searchParams.template : undefined;

  if (params.id !== 'new' && params.id !== 'demo') {
    const resume = await getResume(params.id);
    if (resume) {
      initialData = resume.data;
    }
  }

  return (
    <EditorClient
      initialData={initialData}
      resumeId={params.id}
      userId={session?.user?.id}
      locale={params.locale}
      initialTemplateId={initialTemplateId}
    />
  );
}

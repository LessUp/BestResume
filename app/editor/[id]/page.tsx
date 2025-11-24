import { auth } from "@/auth";
import { getResume } from "@/app/actions";
import EditorClient from "./EditorClient";
import { ResumeData } from "@/types/resume";

export default async function EditorPage({ params }: { params: { id: string } }) {
  const session = await auth();
  let initialData: ResumeData | undefined = undefined;
  
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
    />
  );
}

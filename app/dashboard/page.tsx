import Link from "next/link";
import { auth } from "@/auth";
import { getResumes } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { redirect } from "next/navigation";
import { ResumeCard } from "@/components/dashboard/ResumeCard";

export default async function Dashboard() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const resumes = await getResumes();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
            <p className="text-gray-500 mt-1">Manage your resume versions</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-sm text-gray-600">
               Logged in as <span className="font-semibold">{session.user.email}</span>
             </div>
             <Link href="/editor/new">
               <Button className="gap-2">
                 <Plus className="h-4 w-4" /> Create New
               </Button>
             </Link>
          </div>
        </header>

        {resumes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-dashed">
            <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No resumes yet</h3>
            <p className="text-gray-500 mb-6">Create your first resume to get started</p>
            <Link href="/editor/new">
              <Button variant="outline">Create Resume</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from 'react';
import { ResumeEditor } from "@/components/resume/ResumeEditor";
import { ResumeData } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { saveResume } from '@/app/actions';
import { useResumeStore } from '@/lib/store';
import { Loader2, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EditorClientProps {
  initialData?: ResumeData;
  resumeId?: string;
  userId?: string;
}

export default function EditorClient({ initialData, resumeId, userId }: EditorClientProps) {
  const { resumeData } = useResumeStore();
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!userId) {
      router.push('/auth/signin');
      return;
    }

    setSaving(true);
    try {
      const title = resumeData.basics.name 
        ? `${resumeData.basics.name}'s Resume` 
        : 'Untitled Resume';
      
      // Pass resumeId only if it's a real ID (not 'new' or 'demo')
      const dbId = (resumeId === 'new' || resumeId === 'demo') ? undefined : resumeId;
      
      const result = await saveResume(resumeData, title, dbId);
      
      if (result.success && result.id && resumeId === 'new') {
        // Redirect to the new ID URL so subsequent saves update it
        router.replace(`/editor/${result.id}`);
      }
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 border-b bg-white px-6 flex items-center justify-between sticky top-0 z-10 print:hidden">
        <div className="font-bold text-xl text-blue-600">BestResume</div>
        <div className="text-sm text-gray-500 flex items-center gap-2">
           {resumeId === 'demo' && <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Demo Mode</span>}
           <span className="font-mono text-black">{resumeData.basics.name || 'Untitled'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save
          </Button>
          <Button onClick={handleExport}>
            Export PDF
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-hidden print:overflow-visible">
        <ResumeEditor initialData={initialData} />
      </main>
    </div>
  );
}

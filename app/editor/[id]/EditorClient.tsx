"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ResumeEditor } from "@/components/resume/ResumeEditor";
import { ResumeData } from '@/types/resume';
import { Button } from '@/components/ui/button';
import { saveResume } from '@/app/actions';
import { useResumeStore } from '@/lib/store';
import { Loader2, Save, Check, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface EditorClientProps {
  initialData?: ResumeData;
  resumeId?: string;
  userId?: string;
}

export default function EditorClient({ initialData, resumeId, userId }: EditorClientProps) {
  const { resumeData } = useResumeStore();
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedData, setLastSavedData] = useState<string>(JSON.stringify(initialData));
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const router = useRouter();

  // Handle initial data load only once
  useEffect(() => {
    if (initialData) {
      setLastSavedData(JSON.stringify(initialData));
    }
  }, [initialData]);

  // Check for changes
  useEffect(() => {
    const currentData = JSON.stringify(resumeData);
    if (currentData !== lastSavedData) {
      setIsDirty(true);
    }
  }, [resumeData, lastSavedData]);

  // Warn before unloading if unsaved
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleSave = useCallback(async () => {
    if (!userId || !isDirty) return;

    setSaving(true);
    try {
      const title = resumeData.basics.name 
        ? `${resumeData.basics.name}'s Resume` 
        : 'Untitled Resume';
      
      const dbId = (resumeId === 'new' || resumeId === 'demo') ? undefined : resumeId;
      
      const result = await saveResume(resumeData, title, dbId);
      
      if (result.success) {
        setLastSavedData(JSON.stringify(resumeData));
        setIsDirty(false);
        
        if (result.id && resumeId === 'new') {
          router.replace(`/editor/${result.id}`);
        }
      }
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setSaving(false);
    }
  }, [userId, isDirty, resumeData, resumeId, router]);

  // Auto-save effect
  useEffect(() => {
    if (isDirty && !saving) {
      const timer = setTimeout(() => {
        handleSave();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [isDirty, saving, handleSave]);

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="h-16 border-b bg-white px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 print:hidden shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" title="Back to Dashboard">
              <ArrowLeft className="h-5 w-5 text-gray-500" />
            </Button>
          </Link>
          <div className="flex flex-col">
            <div className="font-bold text-lg text-gray-900 leading-tight">
              {resumeData.basics.name || 'Untitled'}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-2">
               {saving ? (
                 <span className="text-blue-600 flex items-center gap-1">
                   <Loader2 className="h-3 w-3 animate-spin" /> Saving...
                 </span>
               ) : isDirty ? (
                 <span className="text-orange-600">Unsaved changes</span>
               ) : (
                 <span className="text-green-600 flex items-center gap-1">
                   <Check className="h-3 w-3" /> Saved
                 </span>
               )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="xl:hidden" 
            onClick={() => setShowMobilePreview(!showMobilePreview)}
          >
            {showMobilePreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showMobilePreview ? 'Edit' : 'Preview'}
          </Button>

          <Button variant="outline" size="sm" onClick={handleExport}>
            Export PDF
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-hidden print:overflow-visible">
        <ResumeEditor 
          initialData={initialData} 
          mobilePreviewOpen={showMobilePreview}
        />
      </main>
    </div>
  );
}

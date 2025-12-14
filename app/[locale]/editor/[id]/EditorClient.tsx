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
import { useToast } from "@/components/ui/toast";
import { useTranslations } from 'next-intl';

interface EditorClientProps {
  initialData?: ResumeData;
  resumeId?: string;
  userId?: string;
  locale: string;
  initialTemplateId?: string;
}

export default function EditorClient({ initialData, resumeId, userId, locale, initialTemplateId }: EditorClientProps) {
  const { resumeData } = useResumeStore();
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedData, setLastSavedData] = useState<string>(JSON.stringify(initialData));
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const tEditor = useTranslations('Editor');

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
        ? tEditor('defaultTitle', { name: resumeData.basics.name })
        : tEditor('untitled');
      
      const dbId = (resumeId === 'new' || resumeId === 'demo') ? undefined : resumeId;
      
      const result = await saveResume(resumeData, title, dbId, locale);
      
      if (result.success) {
        setLastSavedData(JSON.stringify(resumeData));
        setIsDirty(false);
        
        if (result.id && resumeId === 'new') {
          router.replace(`/${locale}/editor/${result.id}`);
          toast({
            title: tEditor('resumeSavedTitle'),
            description: tEditor('resumeSavedDescription'),
            variant: "success",
          });
        }
      }
    } catch (error) {
      console.error("Failed to save:", error);
      const description = error instanceof Error ? error.message : tEditor('autoSaveFailedDescription');
      toast({
        title: tEditor('autoSaveFailedTitle'),
        description,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }, [userId, isDirty, resumeData, resumeId, router, toast, locale, tEditor]);

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
          <Link href={`/${locale}/dashboard`}>
            <Button variant="ghost" size="icon" title={tEditor('backToDashboard')}>
              <ArrowLeft className="h-5 w-5 text-gray-500" />
            </Button>
          </Link>
          <div className="flex flex-col">
            <div className="font-bold text-lg text-gray-900 leading-tight">
              {resumeData.basics.name || tEditor('untitled')}
            </div>
            <div className="text-xs text-gray-500 flex items-center gap-2">
               {saving ? (
                 <span className="text-blue-600 flex items-center gap-1">
                   <Loader2 className="h-3 w-3 animate-spin" /> {tEditor('saving')}
                 </span>
               ) : isDirty ? (
                 <span className="text-orange-600">{tEditor('unsavedChanges')}</span>
                ) : (
                  <span className="text-green-600 flex items-center gap-1">
                    <Check className="h-3 w-3" /> {tEditor('saved')}
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
            {showMobilePreview ? tEditor('edit') : tEditor('preview')}
          </Button>

          <Button variant="outline" size="sm" onClick={handleExport}>
            {tEditor('exportPDF')}
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-hidden print:overflow-visible">
        <ResumeEditor 
          initialData={initialData} 
          mobilePreviewOpen={showMobilePreview}
          initialTemplateId={initialTemplateId}
        />
      </main>
    </div>
  );
}

'use client';

import Link from "next/link";
import { FileText, Clock, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteResume, duplicateResume } from "@/app/actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { useTranslations } from 'next-intl';

interface ResumeCardProps {
  resume: {
    id: string;
    title: string;
    updatedAt: Date;
  };
  locale: string;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({ resume, locale }) => {
  const t = useTranslations('Common');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm(t('deleteConfirm'))) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteResume(resume.id);
      toast({
        title: t('resumeDeleted'),
        description: t('success'),
        variant: "default",
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to delete resume", error);
      toast({
        title: t('error'),
        description: t('resumeDeleteFailed'),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDuplicating(true);
    try {
      await duplicateResume(resume.id);
      toast({
        title: t('resumeDuplicated'),
        description: t('success'),
        variant: "success",
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to duplicate resume", error);
      toast({
        title: t('error'),
        description: t('resumeDuplicateFailed'),
        variant: "destructive",
      });
    } finally {
      setIsDuplicating(false);
    }
  };

  if (isDeleting) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex items-center justify-center h-full min-h-[200px]">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          <span>{t('deleting')}</span>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/${locale}/editor/${resume.id}`} className="block group h-full">
      <div className="relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 h-full flex flex-col group-hover:shadow-xl group-hover:shadow-blue-500/10">
        
        {/* Gradient Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Resume Preview Mock */}
        <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850 border-b border-gray-100 dark:border-gray-800">
          <div className="aspect-[1/1.2] bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 flex flex-col gap-2">
            {/* Mini Resume Header */}
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900" />
              <div className="flex-1 space-y-1">
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
              </div>
            </div>
            {/* Mini Resume Content */}
            <div className="flex-1 space-y-2">
              <div className="h-1 bg-blue-100 dark:bg-blue-900/50 rounded w-1/4" />
              <div className="space-y-1 pl-2 border-l border-gray-100 dark:border-gray-800">
                <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded w-full" />
                <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded w-4/5" />
              </div>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate transition-colors">
              {resume.title}
            </h3>
            
            {/* Action Buttons */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg"
                onClick={handleDuplicate}
                disabled={isDuplicating}
                title={t('duplicate')}
              >
                <Copy className={`h-3.5 w-3.5 ${isDuplicating ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg"
                onClick={handleDelete}
                title={t('delete')}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          
          <div className="mt-auto flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3 w-3 mr-1.5" />
            {t('updated')} {new Date(resume.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </Link>
  );
};

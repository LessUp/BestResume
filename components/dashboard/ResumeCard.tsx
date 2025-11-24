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
        title: "Error",
        description: "Failed to delete resume. Please try again.",
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
        title: "Error",
        description: "Failed to duplicate resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDuplicating(false);
    }
  };

  if (isDeleting) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg border border-dashed flex items-center justify-center h-full min-h-[160px]">
        <p className="text-gray-500 animate-pulse">Deleting...</p>
      </div>
    );
  }

  return (
    <Link href={`/${locale}/editor/${resume.id}`} className="block group h-full">
      <div className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md hover:border-blue-500 transition-all h-full flex flex-col relative">
        
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <FileText className="h-6 w-6" />
          </div>
          
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600"
              onClick={handleDuplicate}
              disabled={isDuplicating}
              title={t('duplicate')}
            >
              <Copy className={`h-4 w-4 ${isDuplicating ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
              onClick={handleDelete}
              title={t('delete')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 truncate pr-20">
          {resume.title}
        </h3>
        
        <div className="mt-auto flex items-center text-sm text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          {t('updated')} {new Date(resume.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
};

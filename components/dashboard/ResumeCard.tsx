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
      await deleteResume(resume.id, locale);
      toast({
        title: t('resumeDeleted'),
        description: t('success'),
        variant: "default",
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to delete resume", error);
      const description = error instanceof Error ? error.message : t('resumeDeleteFailed');
      toast({
        title: t('error'),
        description,
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
      await duplicateResume(resume.id, locale);
      toast({
        title: t('resumeDuplicated'),
        description: t('success'),
        variant: "success",
      });
      router.refresh();
    } catch (error) {
      console.error("Failed to duplicate resume", error);
      const description = error instanceof Error ? error.message : t('resumeDuplicateFailed');
      toast({
        title: t('error'),
        description,
        variant: "destructive",
      });
    } finally {
      setIsDuplicating(false);
    }
  };

  if (isDeleting) {
    return (
      <div className="bg-muted/50 p-6 rounded-xl border-2 border-dashed border-border flex items-center justify-center h-full min-h-[200px]">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="h-5 w-5 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
          <span>{t('deleting')}</span>
        </div>
      </div>
    );
  }

  return (
    <Link href={`/${locale}/editor/${resume.id}`} className="block group h-full">
      <div className="relative bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300 h-full flex flex-col group-hover:shadow-md">
        
        {/* Gradient Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/60 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Resume Preview Mock */}
        <div className="p-4 bg-muted/30 border-b border-border">
          <div className="aspect-[1/1.2] bg-background rounded-lg shadow-sm border border-border p-3 flex flex-col gap-2 group-hover:scale-[1.02] transition-transform duration-300">
            {/* Mini Resume Header */}
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-muted" />
              <div className="flex-1 space-y-1">
                <div className="h-1.5 bg-muted-foreground/20 rounded w-2/3" />
                <div className="h-1 bg-muted-foreground/10 rounded w-1/2" />
              </div>
            </div>
            {/* Mini Resume Content */}
            <div className="flex-1 space-y-2">
              <div className="h-1 bg-primary/20 rounded w-1/4" />
              <div className="space-y-1 pl-2 border-l border-border">
                <div className="h-1 bg-muted-foreground/10 rounded w-full" />
                <div className="h-1 bg-muted-foreground/10 rounded w-4/5" />
              </div>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-base font-semibold text-foreground group-hover:text-primary truncate transition-colors">
              {resume.title}
            </h3>
            
            {/* Action Buttons */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                onClick={handleDuplicate}
                disabled={isDuplicating}
                title={t('duplicate')}
              >
                <Copy className={`h-3.5 w-3.5 ${isDuplicating ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                onClick={handleDelete}
                title={t('delete')}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          
          <div className="mt-auto flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1.5" />
            {t('updated')} {new Date(resume.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </Link>
  );
};

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
      <div className="relative bg-card rounded-[2rem] border border-border/50 overflow-hidden hover:border-primary/50 transition-all duration-500 h-full flex flex-col hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_50px_-12px_rgba(255,255,255,0.05)]">
        
        {/* Gradient Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-primary/60 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Resume Preview Mock - Improved Design */}
        <div className="p-6 bg-muted/20 border-b border-border/50 relative overflow-hidden group-hover:bg-primary/5 transition-colors duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10" />
          
          <div className="aspect-[1/1.4] bg-background rounded-xl shadow-2xl border border-border/50 p-5 flex flex-col gap-4 group-hover:scale-[1.05] group-hover:-rotate-1 transition-all duration-500">
            {/* Mini Resume Header */}
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                 <div className="h-4 w-4 rounded-full bg-primary/20" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-2 bg-foreground/10 rounded-full w-3/4" />
                <div className="h-1.5 bg-foreground/5 rounded-full w-1/2" />
              </div>
            </div>
            
            {/* Mini Resume Body */}
            <div className="flex-1 space-y-4 pt-2">
              <div className="space-y-2">
                <div className="h-1.5 bg-primary/10 rounded-full w-1/3" />
                <div className="space-y-1.5 pl-3 border-l-2 border-primary/10">
                  <div className="h-1 bg-foreground/5 rounded-full w-full" />
                  <div className="h-1 bg-foreground/5 rounded-full w-5/6" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="h-1.5 bg-primary/10 rounded-full w-1/4" />
                <div className="space-y-1.5 pl-3 border-l-2 border-primary/10">
                  <div className="h-1 bg-foreground/5 rounded-full w-full" />
                  <div className="h-1 bg-foreground/5 rounded-full w-4/5" />
                  <div className="h-1 bg-foreground/5 rounded-full w-2/3" />
                </div>
              </div>
            </div>

            {/* Bottom Accent */}
            <div className="mt-auto pt-4 border-t border-border/50">
               <div className="flex gap-1.5">
                  <div className="h-3 w-8 rounded-full bg-primary/10" />
                  <div className="h-3 w-8 rounded-full bg-primary/5" />
                  <div className="h-3 w-8 rounded-full bg-primary/5" />
               </div>
            </div>
          </div>
        </div>

        {/* Card Content - Refined Typography */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary truncate transition-colors duration-300">
                {resume.title}
              </h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1.5 font-medium">
                <Clock className="h-3.5 w-3.5 mr-2" />
                {t('updated')} {new Date(resume.updatedAt).toLocaleDateString()}
              </div>
            </div>
            
            {/* Action Buttons - More prominent on hover */}
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-xl bg-background border border-border hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
                onClick={handleDuplicate}
                disabled={isDuplicating}
                title={t('duplicate')}
              >
                <Copy className={`h-4 w-4 ${isDuplicating ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-xl bg-background border border-border hover:bg-destructive hover:text-destructive-foreground transition-all shadow-sm"
                onClick={handleDelete}
                title={t('delete')}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-auto">
             <Button variant="ghost" className="w-full justify-between px-0 hover:bg-transparent text-primary font-bold group/btn">
                <span>{t('editResume')}</span>
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:text-primary-foreground transition-all">
                   <FileText className="h-4 w-4" />
                </div>
             </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '@/lib/store';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Globe } from 'lucide-react';
import { ResumeData } from '@/types/resume';

interface ProfileItemProps {
  profile: ResumeData['basics']['profiles'][0];
  index: number;
  updateProfile: (index: number, profile: Partial<ResumeData['basics']['profiles'][0]>) => void;
  removeProfile: (index: number) => void;
}

const ProfileItem = ({ profile, index, updateProfile, removeProfile }: ProfileItemProps) => {
  const [localProfile, setLocalProfile] = useState(profile);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = useTranslations('Resume.forms');

  useEffect(() => {
    setLocalProfile(profile);
  }, [profile]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const scheduleUpdate = (next: ResumeData['basics']['profiles'][0]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      updateProfile(index, next);
    }, 500);
  };

  const handleChange = (field: keyof ResumeData['basics']['profiles'][0], value: string) => {
    setLocalProfile((prev) => {
      const next = { ...prev, [field]: value };
      scheduleUpdate(next);
      return next;
    });
  };

  return (
    <div className="p-6 border border-border/50 rounded-[2rem] bg-card/50 backdrop-blur-sm shadow-sm space-y-6 relative group transition-all duration-300 hover:border-primary/30 hover:shadow-md">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-destructive/10 hover:text-destructive rounded-full"
        onClick={() => removeProfile(index)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('profileNetwork')}</Label>
          <Input
            className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
            value={localProfile.network}
            onChange={(e) => handleChange('network', e.target.value)}
            placeholder={t('profileNetworkPlaceholder')}
          />
        </div>
        <div className="space-y-2.5">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('profileUsername')}</Label>
          <Input
            className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
            value={localProfile.username}
            onChange={(e) => handleChange('username', e.target.value)}
            placeholder={t('profileUsernamePlaceholder')}
          />
        </div>
        <div className="space-y-2.5 md:col-span-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('profileUrl')}</Label>
          <Input
            className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
            value={localProfile.url}
            onChange={(e) => handleChange('url', e.target.value)}
            placeholder={t('profileUrlPlaceholder')}
          />
        </div>
      </div>
    </div>
  );
};

export const BasicsForm = () => {
  const basics = useResumeStore((state) => state.resumeData.basics);
  const updateBasics = useResumeStore((state) => state.updateBasics);
  const updateBasicsLocation = useResumeStore((state) => state.updateBasicsLocation);
  const addProfile = useResumeStore((state) => state.addProfile);
  const updateProfile = useResumeStore((state) => state.updateProfile);
  const removeProfile = useResumeStore((state) => state.removeProfile);
  const t = useTranslations('Resume.forms');

  // Local state for immediate feedback
  const [formData, setFormData] = useState(basics);
  const [locationData, setLocationData] = useState(basics.location);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local state when store changes externally (e.g. initial load or undo)
  useEffect(() => {
    setFormData(basics);
    setLocationData(basics.location);
  }, [basics]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Update local state immediately
    setFormData(prev => ({ ...prev, [name]: value }));

    // Debounce store update
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      updateBasics({ [name]: value });
    }, 500);
  };

  const handleLocationChange =
    (field: keyof ResumeData['basics']['location']) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        setLocationData((prev) => ({ ...prev, [field]: value }));

        if (locationTimeoutRef.current) {
          clearTimeout(locationTimeoutRef.current);
        }

        locationTimeoutRef.current = setTimeout(() => {
          updateBasicsLocation({
            [field]: value,
          } as Partial<ResumeData['basics']['location']>);
        }, 500);
      };

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (locationTimeoutRef.current) {
        clearTimeout(locationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-12">
      {/* Contact Information */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
          <div className="h-4 w-1 bg-primary rounded-full" />
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">{t('basicsTitle')}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2.5">
            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('fullName')}</Label>
            <Input
              id="name"
              name="name"
              className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
              value={formData.name}
              onChange={handleChange}
              placeholder={t('fullNamePlaceholder')}
            />
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="label" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('jobTitle')}</Label>
            <Input
              id="label"
              name="label"
              className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
              value={formData.label}
              onChange={handleChange}
              placeholder={t('jobTitlePlaceholder')}
            />
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('email')}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('emailPlaceholder')}
            />
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('phone')}</Label>
            <Input
              id="phone"
              name="phone"
              className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
              value={formData.phone}
              onChange={handleChange}
              placeholder={t('phonePlaceholder')}
            />
          </div>
          <div className="md:col-span-2 space-y-2.5">
            <Label htmlFor="url" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('website')}</Label>
            <Input
              id="url"
              name="url"
              className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
              value={formData.url || ''}
              onChange={handleChange}
              placeholder={t('websitePlaceholder')}
            />
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
          <div className="h-4 w-1 bg-primary rounded-full" />
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Location</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2.5">
            <Label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('address')}</Label>
            <Input
              id="address"
              className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
              value={locationData.address}
              onChange={handleLocationChange('address')}
              placeholder={t('addressPlaceholder')}
            />
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="city" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('city')}</Label>
            <Input
              id="city"
              className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
              value={locationData.city}
              onChange={handleLocationChange('city')}
              placeholder={t('cityPlaceholder')}
            />
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="postalCode" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('postalCode')}</Label>
            <Input
              id="postalCode"
              className="h-11 rounded-xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
              value={locationData.postalCode}
              onChange={handleLocationChange('postalCode')}
              placeholder={t('postalCodePlaceholder')}
            />
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b border-border/50">
          <div className="h-4 w-1 bg-primary rounded-full" />
          <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">{t('summary')}</h3>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="summary" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 ml-1">{t('summary')}</Label>
          <Textarea
            id="summary"
            name="summary"
            rows={5}
            className="rounded-2xl bg-background border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all resize-none p-4"
            value={formData.summary}
            onChange={handleChange}
            placeholder={t('summaryPlaceholder')}
          />
        </div>
      </section>

      {/* Profiles */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 bg-primary rounded-full" />
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">{t('profilesTitle')}</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-lg text-primary hover:bg-primary/10 font-bold px-3"
            onClick={addProfile}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('addProfile')}
          </Button>
        </div>

        <div className="space-y-4">
          {basics.profiles.map((profile, index) => (
            <ProfileItem
              key={index}
              profile={profile}
              index={index}
              updateProfile={updateProfile}
              removeProfile={removeProfile}
            />
          ))}
          {basics.profiles.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-[2rem] text-muted-foreground/50">
              <Globe className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-sm font-medium">No social profiles added yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

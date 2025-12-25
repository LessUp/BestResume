import React, { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '@/lib/store';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
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
    <div className="p-4 border border-border rounded-lg bg-card shadow-sm space-y-4 relative group">
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => removeProfile(index)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('profileNetwork')}</Label>
          <Input
            value={localProfile.network}
            onChange={(e) => handleChange('network', e.target.value)}
            placeholder={t('profileNetworkPlaceholder')}
          />
        </div>
        <div className="space-y-2">
          <Label>{t('profileUsername')}</Label>
          <Input
            value={localProfile.username}
            onChange={(e) => handleChange('username', e.target.value)}
            placeholder={t('profileUsernamePlaceholder')}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>{t('profileUrl')}</Label>
          <Input
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
    <div className="space-y-4 p-4 border border-border rounded-lg bg-card shadow-sm">
      <h2 className="text-lg font-semibold">{t('basicsTitle')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="image">{t('image')}</Label>
          <Input 
            id="image" 
            name="image" 
            value={formData.image || ''} 
            onChange={handleChange} 
            placeholder={t('imagePlaceholder')} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">{t('fullName')}</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder={t('fullNamePlaceholder')} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="label">{t('jobTitle')}</Label>
          <Input 
            id="label" 
            name="label" 
            value={formData.label} 
            onChange={handleChange} 
            placeholder={t('jobTitlePlaceholder')} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t('email')}</Label>
          <Input 
            id="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder={t('emailPlaceholder')} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t('phone')}</Label>
          <Input 
            id="phone" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder={t('phonePlaceholder')} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">{t('website')}</Label>
          <Input 
            id="url" 
            name="url" 
            value={formData.url} 
            onChange={handleChange} 
            placeholder={t('websitePlaceholder')} 
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">{t('locationTitle')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="location_address">{t('address')}</Label>
            <Input
              id="location_address"
              value={locationData.address}
              onChange={handleLocationChange('address')}
              placeholder={t('addressPlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location_postalCode">{t('postalCode')}</Label>
            <Input
              id="location_postalCode"
              value={locationData.postalCode}
              onChange={handleLocationChange('postalCode')}
              placeholder={t('postalCodePlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location_city">{t('city')}</Label>
            <Input
              id="location_city"
              value={locationData.city}
              onChange={handleLocationChange('city')}
              placeholder={t('cityPlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location_region">{t('region')}</Label>
            <Input
              id="location_region"
              value={locationData.region}
              onChange={handleLocationChange('region')}
              placeholder={t('regionPlaceholder')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location_countryCode">{t('countryCode')}</Label>
            <Input
              id="location_countryCode"
              value={locationData.countryCode}
              onChange={handleLocationChange('countryCode')}
              placeholder={t('countryCodePlaceholder')}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">{t('profilesTitle')}</h3>
          <Button onClick={addProfile} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            {t('addProfile')}
          </Button>
        </div>

        {basics.profiles.length === 0 && (
          <div className="text-center py-6 text-muted-foreground border-2 border-dashed border-border rounded-lg">
            {t('emptyProfiles')}
          </div>
        )}

        {basics.profiles.map((profile, index) => (
          <ProfileItem
            key={index}
            profile={profile}
            index={index}
            updateProfile={updateProfile}
            removeProfile={removeProfile}
          />
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">{t('summary')}</Label>
        <Textarea 
          id="summary" 
          name="summary" 
          value={formData.summary} 
          onChange={handleChange} 
          placeholder={t('summaryPlaceholder')} 
          className="h-32"
        />
      </div>
    </div>
  );
};

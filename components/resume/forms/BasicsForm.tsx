import React, { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '@/lib/store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const BasicsForm = () => {
  const basics = useResumeStore((state) => state.resumeData.basics);
  const updateBasics = useResumeStore((state) => state.updateBasics);
  
  // Local state for immediate feedback
  const [formData, setFormData] = useState(basics);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local state when store changes externally (e.g. initial load or undo)
  useEffect(() => {
    setFormData(basics);
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

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold">Basic Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="John Doe" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="label">Job Title</Label>
          <Input 
            id="label" 
            name="label" 
            value={formData.label} 
            onChange={handleChange} 
            placeholder="Software Engineer" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="john@example.com" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder="+1 234 567 890" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">Website</Label>
          <Input 
            id="url" 
            name="url" 
            value={formData.url} 
            onChange={handleChange} 
            placeholder="https://johndoe.com" 
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea 
          id="summary" 
          name="summary" 
          value={formData.summary} 
          onChange={handleChange} 
          placeholder="Brief summary of your professional background..." 
          className="h-32"
        />
      </div>
    </div>
  );
};

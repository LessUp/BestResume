"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Navbar } from "@/components/layout/Navbar";
import { cn } from "@/lib/utils";
import {
  updateUserProfile,
  updateUserPreferences,
  changePassword,
  deleteAccount,
  type UserProfile
} from "@/app/actions/user";
import {
  User,
  Shield,
  Settings,
  CreditCard,
  Camera,
  Save,
  Eye,
  EyeOff,
  AlertTriangle,
  Check
} from "lucide-react";

interface SettingsClientProps {
  user: UserProfile | null;
  locale: string;
}

export function SettingsClient({ user, locale }: SettingsClientProps) {
  const t = useTranslations('Settings');
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Profile form state
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [website, setWebsite] = useState(user?.website || "");

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  // Preferences state
  const [theme, setTheme] = useState(user?.theme || "system");
  const [language, setLanguage] = useState(user?.language || "zh");

  // Delete account dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const handleSaveProfile = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await updateUserProfile({ name, bio, website }, locale);
      setSuccess(t('profileSaved'));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }
    if (newPassword.length < 8) {
      setError(t('passwordTooShort'));
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await changePassword({ currentPassword, newPassword }, locale);
      setSuccess(t('passwordChanged'));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('passwordChangeFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await updateUserPreferences({ theme, language }, locale);
      setSuccess(t('preferencesSaved'));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('saveFailed'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return;

    setSaving(true);
    try {
      await deleteAccount(locale);
      await signOut({ callbackUrl: `/${locale}` });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('deleteFailed'));
      setSaving(false);
    }
  };

  const tabs = [
    { id: "profile", label: t('profile'), icon: User },
    { id: "security", label: t('security'), icon: Shield },
    { id: "preferences", label: t('preferences'), icon: Settings },
    { id: "billing", label: t('billing'), icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar user={user} locale={locale} />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    activeTab === tab.id
                      ? "bg-card text-primary shadow-sm border border-border"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-primary" : "text-muted-foreground")} />
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            {/* Success/Error Messages */}
            {success && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-green-700 dark:text-green-400 text-sm font-medium">{success}</span>
              </div>
            )}
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm font-medium">
                {error}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{t('profile')}</h2>
                  <p className="text-muted-foreground mt-1">{t('profileDesc')}</p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('basicInfo')}</CardTitle>
                    <CardDescription>{t('basicInfoDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xl font-bold overflow-hidden">
                        {user?.image ? (
                          <img src={user.image} alt={user.name || ""} className="h-full w-full object-cover" />
                        ) : (
                          user?.name?.slice(0, 2).toUpperCase() || "U"
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        {t('changeAvatar')}
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">{t('fullName')}</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">{t('email')}</Label>
                        <Input
                          id="email"
                          value={user?.email || ""}
                          disabled
                          className="mt-1 bg-muted/50"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="website">{t('website')}</Label>
                      <Input
                        id="website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        className="mt-1"
                        placeholder="https://"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">{t('bio')}</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="mt-1"
                        rows={4}
                        placeholder={t('bioPlaceholder')}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSaveProfile} disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? t('saving') : t('saveChanges')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{t('security')}</h2>
                  <p className="text-muted-foreground mt-1">{t('securityDesc')}</p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('changePassword')}</CardTitle>
                    <CardDescription>{t('changePasswordDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">{t('currentPassword')}</Label>
                      <div className="relative mt-1">
                        <Input
                          id="currentPassword"
                          type={showPasswords ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(!showPasswords)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="newPassword">{t('newPassword')}</Label>
                        <Input
                          id="newPassword"
                          type={showPasswords ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                        <Input
                          id="confirmPassword"
                          type={showPasswords ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleChangePassword} disabled={saving}>
                        {saving ? t('saving') : t('updatePassword')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-destructive/30">
                  <CardHeader>
                    <CardTitle className="text-destructive">{t('dangerZone')}</CardTitle>
                    <CardDescription>{t('dangerZoneDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="text-destructive border-destructive/30 hover:bg-destructive/10"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      {t('deleteAccount')}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{t('preferences')}</h2>
                  <p className="text-muted-foreground mt-1">{t('preferencesDesc')}</p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('appearance')}</CardTitle>
                    <CardDescription>{t('appearanceDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>{t('theme')}</Label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger className="mt-1 w-full md:w-64">
                          {theme === 'light' ? t('themeLight') : theme === 'dark' ? t('themeDark') : t('themeSystem')}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">{t('themeLight')}</SelectItem>
                          <SelectItem value="dark">{t('themeDark')}</SelectItem>
                          <SelectItem value="system">{t('themeSystem')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>{t('language')}</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="mt-1 w-full md:w-64">
                          {language === 'zh' ? t('languageZh') : t('languageEn')}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="zh">{t('languageZh')}</SelectItem>
                          <SelectItem value="en">{t('languageEn')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleSavePreferences} disabled={saving}>
                        <Save className="h-4 w-4 mr-2" />
                        {saving ? t('saving') : t('saveChanges')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === "billing" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{t('billing')}</h2>
                  <p className="text-muted-foreground mt-1">{t('billingDesc')}</p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('currentPlan')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-foreground">
                            {user?.membershipType || t('free')}
                          </span>
                          <Badge variant={user?.isMember ? "default" : "secondary"}>
                            {user?.isMember ? t('active') : t('free')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{t('planDescription')}</p>
                      </div>
                      <Button variant="outline">{t('upgradePlan')}</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              {t('deleteAccountTitle')}
            </DialogTitle>
            <DialogDescription>
              {t('deleteAccountWarning')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label>{t('typeDeleteToConfirm')}</Label>
            <Input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              {t('cancel')}
            </Button>
            <Button
              variant="default"
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteConfirm !== "DELETE" || saving}
              onClick={handleDeleteAccount}
            >
              {saving ? t('deleting') : t('deleteAccountConfirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

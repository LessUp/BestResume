"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
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
  Bell,
  CreditCard,
  ArrowLeft,
  Camera,
  Save,
  Eye,
  EyeOff,
  AlertTriangle,
  LogOut,
  FileText,
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
  const [phone, setPhone] = useState(user?.phone || "");
  const [location, setLocation] = useState(user?.location || "");
  const [website, setWebsite] = useState(user?.website || "");
  const [company, setCompany] = useState(user?.company || "");
  const [jobTitle, setJobTitle] = useState(user?.jobTitle || "");

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
      await updateUserProfile({ name, bio, phone, location, website, company, jobTitle }, locale);
      setSuccess(t('profileSaved'));
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      // LocalizedError already has the localized message
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
      // LocalizedError already has the localized message
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
      // LocalizedError already has the localized message
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
      // LocalizedError already has the localized message
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/${locale}/dashboard`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">{t('backToDashboard')}</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <FileText className="h-4 w-4" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white hidden sm:inline">BestResume</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sticky top-24">
              {/* User Info */}
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-200 dark:border-gray-800">
                <Avatar src={user?.image} alt={user?.name || ""} size="lg" />
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{user?.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                      }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Sign Out */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => signOut({ callbackUrl: `/${locale}` })}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                >
                  <LogOut className="h-4 w-4" />
                  {t('signOut')}
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Success/Error Messages */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-green-700 dark:text-green-400">{success}</span>
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('profile')}</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">{t('profileDesc')}</p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('avatar')}</CardTitle>
                    <CardDescription>{t('avatarDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6">
                      <Avatar src={user?.image} alt={user?.name || ""} size="xl" />
                      <div className="space-y-2">
                        <Button variant="outline" size="sm">
                          <Camera className="h-4 w-4 mr-2" />
                          {t('changeAvatar')}
                        </Button>
                        <p className="text-xs text-gray-500">{t('avatarHint')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('personalInfo')}</CardTitle>
                    <CardDescription>{t('personalInfoDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                          className="mt-1 bg-gray-50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">{t('phone')}</Label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">{t('location')}</Label>
                        <Input
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="mt-1"
                          placeholder={t('locationPlaceholder')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">{t('company')}</Label>
                        <Input
                          id="company"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="jobTitle">{t('jobTitle')}</Label>
                        <Input
                          id="jobTitle"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          className="mt-1"
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
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('security')}</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">{t('securityDesc')}</p>
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
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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

                <Card className="border-red-200 dark:border-red-800">
                  <CardHeader>
                    <CardTitle className="text-red-600">{t('dangerZone')}</CardTitle>
                    <CardDescription>{t('dangerZoneDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
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
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('preferences')}</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">{t('preferencesDesc')}</p>
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
                          <SelectValue />
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
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="zh">中文</SelectItem>
                          <SelectItem value="en">English</SelectItem>
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
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('billing')}</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">{t('billingDesc')}</p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>{t('currentPlan')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            {user?.membershipType || "Free"}
                          </span>
                          <Badge variant={user?.isMember ? "success" : "secondary"}>
                            {user?.isMember ? t('active') : t('free')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{t('planDescription')}</p>
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
            <DialogTitle className="text-red-600 flex items-center gap-2">
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
              className="bg-red-600 hover:bg-red-700"
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

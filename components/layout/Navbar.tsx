"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import {
  FileText,
  LayoutDashboard,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  Plus,
  ChevronDown,
} from "lucide-react";

interface NavbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  locale: string;
}

export function Navbar({ user, locale }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('Nav');

  const navigation = [
    { name: t('dashboard'), href: `/${locale}/dashboard`, icon: LayoutDashboard },
    { name: t('templates'), href: `/${locale}/templates`, icon: FileText },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-10">
            <Link href={`/${locale}`} className="flex items-center gap-2.5 group transition-all">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-500" />
                <div className="relative h-9 w-9 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg transform group-hover:scale-105 transition duration-500">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
              <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 group-hover:to-primary transition-all duration-500">
                BestResume
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                    isActive(item.href)
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  <item.icon className={`h-4 w-4 ${isActive(item.href) ? "text-primary" : "text-muted-foreground/70"}`} />
                  {item.name}
                  {isActive(item.href) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Create Button */}
                <Link href={`/${locale}/editor/new`} className="hidden sm:block">
                  <Button size="sm" className="gap-2 h-9 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 active:scale-95">
                    <Plus className="h-4 w-4" />
                    <span className="font-bold">{t('newResume')}</span>
                  </Button>
                </Link>

                <div className="h-6 w-px bg-border/50 hidden sm:block mx-1" />

                <LanguageSwitcher />

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="group flex items-center gap-2 p-0.5 pr-2 rounded-full hover:bg-accent/50 transition-all duration-300 border border-border/50 hover:border-primary/30">
                      <Avatar src={user.image} alt={user.name || ""} size="sm" className="h-8 w-8 rounded-full border border-background shadow-sm" />
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl border-border/50 shadow-2xl backdrop-blur-xl">
                    <DropdownMenuLabel className="p-3">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-sm tracking-tight">{user.name}</span>
                        <span className="text-xs text-muted-foreground font-normal truncate">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <div className="p-1 space-y-1">
                      <DropdownMenuItem 
                        className="rounded-xl focus:bg-primary/5 focus:text-primary transition-all duration-200 cursor-pointer p-2.5"
                        onClick={() => window.location.href = `/${locale}/dashboard`}
                      >
                        <LayoutDashboard className="h-4 w-4 mr-3 opacity-70" />
                        <span className="font-medium">{t('dashboard')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="rounded-xl focus:bg-primary/5 focus:text-primary transition-all duration-200 cursor-pointer p-2.5"
                        onClick={() => window.location.href = `/${locale}/settings`}
                      >
                        <Settings className="h-4 w-4 mr-3 opacity-70" />
                        <span className="font-medium">{t('settings')}</span>
                      </DropdownMenuItem>
                    </div>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <div className="p-1">
                      <DropdownMenuItem 
                        className="rounded-xl focus:bg-destructive/10 focus:text-destructive text-destructive transition-all duration-200 cursor-pointer p-2.5"
                        onClick={() => signOut({ callbackUrl: `/${locale}` })}
                      >
                        <LogOut className="h-4 w-4 mr-3 opacity-70" />
                        <span className="font-medium">{t('signOut')}</span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <LanguageSwitcher />
                <div className="h-6 w-px bg-border/50 hidden sm:block mx-1" />
                <Link href={`/${locale}/auth/signin`}>
                  <Button variant="ghost" size="sm" className="rounded-full font-bold hover:bg-primary/5 hover:text-primary transition-all">
                    {t('signIn')}
                  </Button>
                </Link>
                <Link href={`/${locale}/auth/signup`} className="hidden sm:block">
                  <Button size="sm" className="rounded-full font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105">
                    {t('getStarted')}
                  </Button>
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-accent/50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-foreground" />
              ) : (
                <Menu className="h-5 w-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-in slide-in-from-top-4 duration-300">
            <div className="space-y-1.5 px-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
              {user && (
                <Link
                  href={`/${locale}/editor/new`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all"
                >
                  <Plus className="h-5 w-5" />
                  {t('newResume')}
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

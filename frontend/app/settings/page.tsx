"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AppLayout } from "../../components/layout/AppLayout";
import { useTheme } from "next-themes";
import { useColorMode, ColorMode } from "../../context/ColorModeContext";
import { useAuthStore } from "../../store/useAuthStore";
import {
  ArrowLeft,
  User,
  Sun,
  Moon,
  Check,
  AlertTriangle,
  LogOut,
  Save,
} from "lucide-react";

const COLOR_OPTIONS: { id: ColorMode; label: string; colorHex: string }[] = [
  { id: "amber", label: "Amber", colorHex: "#f59e0b" },
  { id: "blue", label: "Blue", colorHex: "#2563eb" },
  { id: "pink", label: "Pink", colorHex: "#ec4899" },
  { id: "rose", label: "Rose", colorHex: "#f43f5e" },
  { id: "emerald", label: "Emerald", colorHex: "#10b981" },
  { id: "black", label: "Black", colorHex: "#09090b" },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { colorMode, setColorMode } = useColorMode();
  const logout = useAuthStore((state) => state.logout);
  const userId = useAuthStore((state) => state.userId);

  // Form State
  const [fullName, setFullName] = useState("Dexter");
  const [email, setEmail] = useState("guest.dexter@ablespace.io");
  const [username, setUsername] = useState("dexter_admin");
  const [title, setTitle] = useState("Senior Product Lead");
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Back to App Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to app</span>
          </Link>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-xs text-muted-foreground">
            Manage your account preferences, theme appearance, and workspace
            settings.
          </p>
        </div>

        {/* Profile Card matching Figma SS13 */}
        <div className="border border-border rounded-2xl bg-card p-6 shadow-2xs space-y-6">
          <div className="flex items-center space-x-2 pb-4 border-b border-border">
            <User className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">
              Profile Information
            </h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {/* Avatar & Photo Header */}
            <div className="flex items-center space-x-4">
              <Image
                src="https://api.dicebear.com/7.x/notionists/svg?seed=Dexter&backgroundColor=b6e3f4"
                alt="Dexter"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full border-2 border-border"
              />
              <div className="space-y-1">
                <div className="text-xs font-semibold text-foreground">
                  Dexter
                </div>
                <div className="text-[11px] text-muted-foreground">
                  User ID:{" "}
                  <span className="font-mono text-[10px]">
                    {userId || "Guest Session"}
                  </span>
                </div>
              </div>
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-medium text-foreground">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-foreground">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-foreground">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-foreground">Job Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              {isSaved && (
                <span className="text-xs text-emerald-500 font-medium flex items-center">
                  <Check className="h-3.5 w-3.5 mr-1 stroke-[3]" /> Profile
                  updated
                </span>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-foreground text-background text-xs font-semibold rounded-xl hover:opacity-90 transition-opacity cursor-pointer flex items-center space-x-1.5 shadow-2xs"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        </div>

        {/* Appearance Settings Section matching Figma SS10/SS13 */}
        <div className="border border-border rounded-2xl bg-card p-6 shadow-2xs space-y-6">
          <div className="pb-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">
              Appearance Preferences
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Customize Light/Dark mode and primary color mode accent across the
              app.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Theme Selector */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Theme
              </label>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    theme === "light"
                      ? "border-primary bg-muted/60 font-semibold"
                      : "border-border hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4 text-amber-500" />
                    <span>Light Mode</span>
                  </div>
                  {theme === "light" && (
                    <Check className="h-4 w-4 text-foreground stroke-[2.5]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    theme === "dark"
                      ? "border-primary bg-muted/60 font-semibold"
                      : "border-border hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Moon className="h-4 w-4 text-blue-400" />
                    <span>Dark Mode</span>
                  </div>
                  {theme === "dark" && (
                    <Check className="h-4 w-4 text-foreground stroke-[2.5]" />
                  )}
                </button>
              </div>
            </div>

            {/* Color Mode Accent Selector matching Figma SS10 */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Color Mode Accent
              </label>
              <div className="grid grid-cols-3 gap-2.5 text-xs">
                {COLOR_OPTIONS.map((c) => {
                  const isSelected = colorMode === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setColorMode(c.id)}
                      className={`p-2.5 rounded-xl border flex items-center space-x-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-muted/60 font-semibold"
                          : "border-border hover:bg-muted/30"
                      }`}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-border shrink-0"
                        style={{ backgroundColor: c.colorHex }}
                      />
                      <span className="truncate">{c.label}</span>
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-foreground stroke-[3] ml-auto shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Card matching Figma SS13 */}
        <div className="border border-destructive/30 rounded-2xl bg-destructive/5 p-6 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="text-sm font-semibold">Workspace Access</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Leaving this workspace will clear your local guest session and
            redirect you to the login screen.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                logout();
                window.location.href = "/login";
              }}
              className="px-4 py-2 bg-destructive text-white text-xs font-semibold rounded-xl hover:bg-destructive/90 transition-opacity cursor-pointer inline-flex items-center space-x-2 shadow-2xs"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Leave Workspace</span>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

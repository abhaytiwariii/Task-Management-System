"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useColorMode, ColorMode } from "../../context/ColorModeContext";
import { useAuthStore } from "../../store/useAuthStore";
import {
  Sun,
  Moon,
  Check,
  Palette,
  User,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

const COLOR_OPTIONS: { id: ColorMode; label: string; colorHex: string }[] = [
  { id: "amber", label: "Amber", colorHex: "#f59e0b" },
  { id: "blue", label: "Blue", colorHex: "#2563eb" },
  { id: "pink", label: "Pink", colorHex: "#ec4899" },
  { id: "rose", label: "Rose", colorHex: "#f43f5e" },
  { id: "emerald", label: "Emerald", colorHex: "#10b981" },
  { id: "black", label: "Black", colorHex: "#09090b" },
];

export function UserProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<
    "main" | "theme" | "color"
  >("main");

  const popoverRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const { colorMode, setColorMode } = useColorMode();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveSubmenu("main");
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      {/* Trigger Button matching Figma SS10 */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer hover:bg-sidebar-hover p-2 rounded-lg transition-colors -mx-2 select-none"
      >
        <div className="flex items-center gap-3">
          <Image
            src="https://api.dicebear.com/7.x/notionists/svg?seed=Dexter&backgroundColor=b6e3f4"
            alt="Dexter"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full border border-border"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-sm leading-none">Dexter</span>
            <span className="text-[11px] text-muted-foreground leading-tight">
              Admin
            </span>
          </div>
        </div>
      </div>

      {/* Profile Menu Popover matching Figma SS10 */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl z-50 p-2 animate-in fade-in-50 zoom-in-95 space-y-1">
          {activeSubmenu === "main" && (
            <>
              {/* Profile / Settings */}
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-xs rounded-xl hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Profile & Settings</span>
                </div>
              </Link>

              {/* Change Theme trigger */}
              <button
                type="button"
                onClick={() => setActiveSubmenu("theme")}
                className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  {theme === "dark" ? (
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Sun className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="font-medium">Change Theme</span>
                </div>
                <div className="flex items-center space-x-1 text-muted-foreground text-[11px]">
                  <span className="capitalize">{theme || "Light"}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </button>

              {/* Color Mode trigger matching Figma SS10 */}
              <button
                type="button"
                onClick={() => setActiveSubmenu("color")}
                className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Color Mode</span>
                </div>
                <div className="flex items-center space-x-1.5 text-muted-foreground text-[11px]">
                  <span
                    className="h-3 w-3 rounded-full border border-border"
                    style={{
                      backgroundColor:
                        COLOR_OPTIONS.find((c) => c.id === colorMode)
                          ?.colorHex || "#09090b",
                    }}
                  />
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </button>

              <div className="border-t border-border my-1" />

              {/* Logout */}
              <button
                type="button"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-medium">Log Out</span>
              </button>
            </>
          )}

          {/* Submenu: Theme Options */}
          {activeSubmenu === "theme" && (
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <span>Theme</span>
                <button
                  type="button"
                  onClick={() => setActiveSubmenu("main")}
                  className="text-primary hover:underline cursor-pointer"
                >
                  Back
                </button>
              </div>

              {[
                { id: "light", label: "Light", icon: Sun },
                { id: "dark", label: "Dark", icon: Moon },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = theme === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTheme(item.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 text-foreground stroke-[2.5]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Submenu: Color Mode Options matching Figma SS10 */}
          {activeSubmenu === "color" && (
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <span>Color Mode</span>
                <button
                  type="button"
                  onClick={() => setActiveSubmenu("main")}
                  className="text-primary hover:underline cursor-pointer"
                >
                  Back
                </button>
              </div>

              <div className="grid grid-cols-6 gap-1.5 p-2 bg-muted/30 rounded-xl border border-border">
                {COLOR_OPTIONS.map((c) => {
                  const isSelected = colorMode === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setColorMode(c.id)}
                      title={c.label}
                      className={`h-7 w-7 rounded-full flex items-center justify-center transition-transform cursor-pointer border ${
                        isSelected
                          ? "ring-2 ring-primary ring-offset-2 scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: c.colorHex }}
                    >
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-white stroke-[3]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

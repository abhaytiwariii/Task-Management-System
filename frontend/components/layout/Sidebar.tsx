"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, FolderKanban, Settings, ChevronDown } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "../ThemeToggle";
import { UserProfileDropdown } from "./UserProfileDropdown";

export function Sidebar() {
  const pathname = usePathname();

  const isTasksActive = pathname === "/" || pathname === "/tasks";
  const isProjectsActive = pathname.startsWith("/projects");

  return (
    <aside className="w-64 border-r border-border bg-sidebar text-foreground flex flex-col h-full py-4 shrink-0">
      <div className="flex flex-col gap-6 px-4">
        {/* User Profile Dropdown Header matching Figma SS10 */}
        <UserProfileDropdown />

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 -mx-2">
          <div className="text-xs font-medium text-muted-foreground mb-1 px-3">
            Workspace
          </div>
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isTasksActive
                ? "bg-sidebar-hover text-foreground font-semibold"
                : "text-muted-foreground hover:bg-sidebar-hover hover:text-foreground"
            }`}
          >
            <LayoutGrid
              className={`w-4 h-4 ${isTasksActive ? "text-foreground" : "text-muted-foreground"}`}
            />
            <span>Tasks</span>
          </Link>

          <Link
            href="/projects"
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isProjectsActive
                ? "bg-sidebar-hover text-foreground font-semibold"
                : "text-muted-foreground hover:bg-sidebar-hover hover:text-foreground"
            }`}
          >
            <FolderKanban
              className={`w-4 h-4 ${isProjectsActive ? "text-foreground" : "text-muted-foreground"}`}
            />
            <span>Projects</span>
          </Link>
        </nav>
      </div>

      <div className="mt-auto px-2">
        <div className="flex items-center justify-between border-t border-border pt-4 px-2">
          <Link
            href="/settings"
            className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}

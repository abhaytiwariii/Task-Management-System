"use client";

import * as React from "react";
import { LayoutGrid, FolderKanban, CheckSquare, Settings, ChevronDown } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";


export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-sidebar text-foreground flex flex-col h-full py-4">
      <div className="flex flex-col gap-6 px-4">
        {/* User Profile Dropdown */}
        <div className="flex items-center justify-between cursor-pointer hover:bg-sidebar-hover p-2 rounded-lg transition-colors -mx-2">
          <div className="flex items-center gap-3">
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?seed=Dexter&backgroundColor=b6e3f4"
              alt="Dexter"
              className="w-8 h-8 rounded-full border border-border"
            />
            <span className="font-medium text-sm">Dexter</span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>

        <nav className="flex flex-col gap-1 -mx-2">
          <div className="text-xs font-medium text-muted-foreground mb-1 px-3">Workspace</div>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-sidebar-hover text-foreground transition-colors"
          >
            <LayoutGrid className="w-4 h-4 text-foreground" />
            Tasks
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-sidebar-hover text-muted-foreground hover:text-foreground transition-colors"
          >
            <FolderKanban className="w-4 h-4 text-muted-foreground" />
            Projects
          </a>
        </nav>
      </div>

      <div className="mt-auto px-2">
        <div className="flex items-center justify-between border-t border-border pt-4 px-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}


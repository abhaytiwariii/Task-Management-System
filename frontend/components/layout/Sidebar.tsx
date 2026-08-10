"use client";

import * as React from "react";
import { LayoutGrid, FolderKanban, CheckSquare, Settings } from "lucide-react";
import { ThemeToggle } from "../ThemeToggle";

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-sidebar text-foreground flex flex-col justify-between h-full min-h-screen p-4">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 px-2">
          <div className="w-7 h-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
            A
          </div>
          <span className="font-semibold text-lg tracking-tight">AbleSpace</span>
        </div>

        <nav className="flex flex-col gap-1">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md bg-sidebar-hover text-foreground transition-colors"
          >
            <CheckSquare className="w-4 h-4 text-muted-foreground" />
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

      <div className="flex items-center justify-between border-t border-border pt-4 px-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </div>
        <ThemeToggle />
      </div>
    </aside>
  );
}

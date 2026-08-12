"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  List as ListIcon,
  LayoutGrid as BoardIcon,
  Check,
  SlidersHorizontal,
} from "lucide-react";

export interface FieldConfig {
  key: string;
  label: string;
}

export const AVAILABLE_FIELDS: FieldConfig[] = [
  { key: "priority", label: "Priority" },
  { key: "members", label: "Members" },
  { key: "dueDate", label: "Due Date" },
  { key: "labels", label: "Labels" },
  { key: "status", label: "Status" },
  { key: "reporter", label: "Reporter" },
];

export interface FieldsState {
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  labels: boolean;
  status: boolean;
  reporter: boolean;
  [key: string]: boolean;
}

interface FieldsPopoverProps {
  viewMode: "board" | "list";
  onViewModeChange: (mode: "board" | "list") => void;
  visibleFields: FieldsState;
  onToggleField: (fieldKey: string) => void;
}

export const FieldsPopover: React.FC<FieldsPopoverProps> = ({
  viewMode,
  onViewModeChange,
  visibleFields,
  onToggleField,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
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
      {/* Fields Trigger Button matching Figma*/}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors cursor-pointer ${
          isOpen
            ? "bg-muted border-border text-foreground shadow-2xs"
            : "bg-background border-border text-foreground hover:bg-muted"
        }`}
      >
        <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
        <span>Fields</span>
      </button>

      {/* Popover Dropdown Container - Fully Theme Aware via Theme Tokens */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl ring-1 ring-black/10 z-50 p-2.5 animate-in fade-in-50 zoom-in-95">
          {/* Top View Switcher Tabs (List | Board) matching Figma */}
          <div className="flex bg-muted p-1 rounded-xl mb-2.5 border border-border/50">
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-card text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ListIcon className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("board")}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                viewMode === "board"
                  ? "bg-card text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BoardIcon className="h-3.5 w-3.5" />
              <span>Board</span>
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-border my-1" />

          {/* Data-Driven Field Visibility Checkboxes matching Figma */}
          <div className="space-y-0.5 py-1">
            {AVAILABLE_FIELDS.map((field) => {
              const isChecked = visibleFields[field.key] ?? false;
              return (
                <div
                  key={field.key}
                  onClick={() => onToggleField(field.key)}
                  className="flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg hover:bg-muted/70 transition-colors cursor-pointer group"
                >
                  <span className="text-foreground group-hover:text-foreground font-medium">
                    {field.label}
                  </span>
                  <div
                    className={`h-4 w-4 rounded-md border transition-colors flex items-center justify-center ${
                      isChecked
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground/40 bg-card hover:border-muted-foreground"
                    }`}
                  >
                    {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

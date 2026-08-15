"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { PrioritySignalIcon, PriorityLevel } from "./PrioritySignalIcon";

interface PriorityPopoverProps {
  currentPriority: PriorityLevel;
  onSelectPriority: (priority: PriorityLevel) => void;
}

const PRIORITIES: PriorityLevel[] = ["No Priority", "Urgent", "High", "Medium", "Low"];

export const PriorityPopover: React.FC<PriorityPopoverProps> = ({
  currentPriority,
  onSelectPriority,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
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

  const activePriority = currentPriority || "No Priority";

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 px-2 py-1 text-xs rounded-md hover:bg-muted/80 transition-colors cursor-pointer border border-border/40"
      >
        <PrioritySignalIcon priority={activePriority} showLabel={true} />
        <ChevronDown className="h-3 w-3 text-muted-foreground ml-0.5" />
      </button>

      {/* Popover Dropdown matching Figma SS6 */}
      {isOpen && (
        <div className="absolute right-0 mt-1 w-44 rounded-xl border border-border bg-popover text-popover-foreground shadow-xl ring-1 ring-black/10 z-50 p-1.5 animate-in fade-in-50 zoom-in-95">
          <div className="text-[10px] font-semibold text-muted-foreground px-2 py-1 uppercase tracking-wider">
            Priority
          </div>
          <div className="space-y-0.5">
            {PRIORITIES.map((p) => {
              const isSelected = activePriority === p;
              return (
                <div
                  key={p}
                  onClick={() => {
                    onSelectPriority(p);
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-between px-2 py-1.5 text-xs rounded-lg hover:bg-muted transition-colors cursor-pointer"
                >
                  <PrioritySignalIcon priority={p} showLabel={true} />
                  {isSelected && <Check className="h-3.5 w-3.5 text-foreground stroke-[2.5]" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

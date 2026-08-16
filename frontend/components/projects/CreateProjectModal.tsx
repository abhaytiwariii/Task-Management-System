"use client";

import React, { useState } from "react";
import { X, Calendar } from "lucide-react";
import { useProjectStore } from "../../store/useProjectStore";
import { PriorityPopover } from "../tasks/PriorityPopover";
import { PriorityLevel } from "../tasks/PrioritySignalIcon";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const addProject = useProjectStore((state) => state.addProject);

  const [name, setName] = useState("");
  const [priority, setPriority] = useState<PriorityLevel>("Medium");
  const [lead, setLead] = useState("Admin");
  const [dueDate, setDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await addProject({
        name: name.trim(),
        priority: priority || "Medium",
        lead: lead.trim() || "Admin",
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      });
      setName("");
      setPriority("Medium");
      setLead("Admin");
      setDueDate("");
      onClose();
    } catch (err) {
      console.error("Failed to create project:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-50">
      <div className="bg-popover text-popover-foreground rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Add Project</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-medium text-foreground">Project Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Design Homepage"
              required
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-medium text-foreground">Priority</label>
              <div className="pt-0.5">
                <PriorityPopover
                  currentPriority={priority}
                  onSelectPriority={(p) => setPriority(p)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-medium text-foreground">Project Lead</label>
              <input
                type="text"
                value={lead}
                onChange={(e) => setLead(e.target.value)}
                placeholder="e.g. Admin"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-foreground">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-4 py-2 rounded-lg bg-foreground text-background font-medium hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

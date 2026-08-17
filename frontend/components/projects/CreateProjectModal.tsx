"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useProjectStore, Project } from "../../store/useProjectStore";
import { PriorityPopover } from "../tasks/PriorityPopover";
import { PriorityLevel } from "../tasks/PrioritySignalIcon";
import { CustomDatePicker } from "../common/CustomDatePicker";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
}

export function CreateProjectModal({ isOpen, onClose, projectToEdit }: CreateProjectModalProps) {
  const addProject = useProjectStore((state) => state.addProject);
  const updateProject = useProjectStore((state) => state.updateProject);

  const [name, setName] = useState("");
  const [priority, setPriority] = useState<PriorityLevel>("Medium");
  const [lead, setLead] = useState("Admin");
  const [dueDate, setDueDate] = useState<Date | null>(() => new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name || "");
      setPriority((projectToEdit.priority as PriorityLevel) || "Medium");
      setLead(projectToEdit.lead || "Admin");
      setDueDate(projectToEdit.dueDate ? new Date(projectToEdit.dueDate) : new Date());
    } else {
      setName("");
      setPriority("Medium");
      setLead("Admin");
      setDueDate(new Date());
    }
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      if (projectToEdit) {
        await updateProject(projectToEdit.id, {
          name: name.trim(),
          priority: priority || "Medium",
          lead: lead.trim() || "Admin",
          dueDate: dueDate ? dueDate.toISOString() : undefined,
        });
      } else {
        await addProject({
          name: name.trim(),
          priority: priority || "Medium",
          lead: lead.trim() || "Admin",
          dueDate: dueDate ? dueDate.toISOString() : undefined,
        });
      }
      onClose();
    } catch (err) {
      console.error("Failed to save project:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = !!projectToEdit;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-50">
      <div className="bg-popover text-popover-foreground rounded-2xl shadow-2xl w-full max-w-md border border-border relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">
            {isEditing ? "Edit Project" : "Add Project"}
          </h2>
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
              className="w-full px-3 py-2 border border-border rounded-xl bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-medium text-foreground">Priority</label>
              <div className="pt-0.5">
                <PriorityPopover
                  currentPriority={priority}
                  onSelectPriority={(p) => setPriority(p)}
                  fullWidth={true}
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
                className="w-full px-3 py-2 border border-border rounded-xl bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-medium text-foreground">Due Date</label>
            <CustomDatePicker
              selectedDate={dueDate}
              onSelectDate={(d) => setDueDate(d)}
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-4 py-2 rounded-xl bg-foreground text-background font-medium hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

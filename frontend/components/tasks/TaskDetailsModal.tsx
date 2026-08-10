"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Tag, User, Signal } from "lucide-react";
import { Task, useTaskStore } from "../../store/useTaskStore";

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetailsModal({ task, isOpen, onClose }: TaskDetailsModalProps) {
  const updateTask = useTaskStore((state) => state.updateTask);
  
  // Local state for edits
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");

  // Sync local state when a new task is opened
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority || "Medium");
      setStatus(task.status);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSave = async () => {
    await updateTask(task.id, {
      title,
      description,
      priority,
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-border">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-semibold text-xl text-foreground bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary rounded px-2 w-2/3"
          />
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Layout matching the Figma reference */}
        <div className="flex flex-1 overflow-hidden h-[600px]">
          {/* Main Content Area (Left) */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a more detailed description..."
                className="w-full h-32 p-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
              />
            </div>
            
            {/* Save Button for the edits */}
            <button 
              onClick={handleSave}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:opacity-90 transition-opacity text-sm cursor-pointer"
            >
              Save Changes
            </button>
          </div>

          {/* Properties Sidebar (Right) */}
          <div className="w-72 bg-muted/30 p-6 overflow-y-auto border-l border-border space-y-6">
            <h3 className="font-semibold text-sm">Details</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center"><Tag className="h-4 w-4 mr-2"/> Status</span>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-transparent border border-border rounded p-1 text-right focus:outline-none focus:ring-1 text-sm cursor-pointer"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">Doing</option>
                  <option value="DONE">Completed</option>
                  <option value="ON_HOLD">On Hold</option>
                </select>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center"><Signal className="h-4 w-4 mr-2"/> Priority</span>
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="bg-transparent border border-border rounded p-1 text-right focus:outline-none focus:ring-1 text-sm cursor-pointer"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

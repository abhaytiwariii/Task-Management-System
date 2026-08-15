"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Lock,
  Eye,
  Share2,
  MoreHorizontal,
  Sidebar as SidebarIcon,
  Plus,
  Paperclip,
  Send,
  Tag as TagIcon,
  Smile,
  Trash2,
} from "lucide-react";
import { Task, useTaskStore } from "../../store/useTaskStore";
import { PriorityPopover } from "./PriorityPopover";
import { DatePickerPopover } from "./DatePickerPopover";
import { PrioritySignalIcon, PriorityLevel } from "./PrioritySignalIcon";

interface SubItem {
  id: string;
  title: string;
  priority: PriorityLevel;
  dueDate: string;
  assignee: string;
}

interface CommentItem {
  id: string;
  author: string;
  avatarSeed: string;
  timestamp: string;
  content: string;
}

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetailsModal({ task, isOpen, onClose }: TaskDetailsModalProps) {
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

  // Core task form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<PriorityLevel>("Medium");
  const [status, setStatus] = useState("TODO");
  const [dueDate, setDueDate] = useState<string | null>(null);

  // Interactive UI subtasks & comments state (Figma SS6 presentation)
  const [subtasks, setSubtasks] = useState<SubItem[]>([
    { id: "s1", title: "Subtask 1", priority: "High", dueDate: "12 Sep 2026", assignee: "Admin" },
    { id: "s2", title: "Subtask 2", priority: "Low", dueDate: "15 Sep 2026", assignee: "CN" },
    { id: "s3", title: "Subtask 3", priority: "Medium", dueDate: "18 Sep 2026", assignee: "Security" },
  ]);

  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: "c1",
      author: "Ankit Dutta",
      avatarSeed: "Ankit",
      timestamp: "just now",
      content: "Create clear and detailed documentation for inventory & sales metrics.",
    },
  ]);
  const [newComment, setNewComment] = useState("");

  const [updates, setUpdates] = useState<ActivityItem[]>([
    { id: "u1", user: "You", action: "changed priority from No priority to High", timestamp: "Aug 2026" },
    { id: "u2", user: "You", action: "posted an update", timestamp: "Aug 2026" },
  ]);

  // Sync state when task prop changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority((task.priority as PriorityLevel) || "High");
      setStatus(task.status || "TODO");
      setDueDate(task.dueDate || null);
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSavePriority = async (newP: PriorityLevel) => {
    setPriority(newP);
    await updateTask(task.id, { priority: newP });
    setUpdates((prev) => [
      { id: Date.now().toString(), user: "You", action: `changed priority to ${newP}`, timestamp: "Just now" },
      ...prev,
    ]);
  };

  const handleSaveDate = async (newDateIso: string) => {
    setDueDate(newDateIso);
    await updateTask(task.id, { dueDate: newDateIso });
    setUpdates((prev) => [
      { id: Date.now().toString(), user: "You", action: "updated due date", timestamp: "Just now" },
      ...prev,
    ]);
  };

  const handleSaveStatus = async (newStatus: string) => {
    setStatus(newStatus);
    await updateTask(task.id, { status: newStatus });
  };

  const handleSaveTitleDesc = async () => {
    await updateTask(task.id, { title, description });
  };

  const handleDelete = async () => {
    await deleteTask(task.id);
    onClose();
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: newSubtaskTitle.trim(),
        priority: "Low",
        dueDate: "20 Sep 2026",
        assignee: "You",
      },
    ]);
    setNewSubtaskTitle("");
    setIsAddingSubtask(false);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        author: "You",
        avatarSeed: "User",
        timestamp: "just now",
        content: newComment.trim(),
      },
    ]);
    setNewComment("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in-50">
      <div className="bg-background text-foreground rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden border border-border">
        
        {/* Top Header Action Bar matching Figma SS6 */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card">
          <div className="flex items-center space-x-2 text-muted-foreground text-xs font-medium">
            <span>Tasks</span>
            <span>/</span>
            <span className="text-foreground font-semibold truncate max-w-[300px]">{title}</span>
          </div>

          {/* Action Toolbar Icons (Lock, Watch 1, Share, More, Toggle Panel) */}
          <div className="flex items-center space-x-2">
            <button type="button" className="p-1.5 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground transition-colors cursor-pointer" title="Private">
              <Lock className="h-3.5 w-3.5" />
            </button>
            <button type="button" className="p-1.5 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground transition-colors cursor-pointer flex items-center space-x-1" title="Watchers">
              <Eye className="h-3.5 w-3.5" />
              <span className="text-[11px] font-semibold">1</span>
            </button>
            <button type="button" className="p-1.5 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground transition-colors cursor-pointer" title="Share">
              <Share2 className="h-3.5 w-3.5" />
            </button>
            <button type="button" onClick={handleDelete} className="p-1.5 rounded-lg border border-destructive/30 hover:bg-destructive/10 text-destructive transition-colors cursor-pointer" title="Delete Task">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <button type="button" className="p-1.5 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground transition-colors cursor-pointer" title="More">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
            <button type="button" className="p-1.5 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground transition-colors cursor-pointer" title="Toggle Side Panel">
              <SidebarIcon className="h-3.5 w-3.5" />
            </button>
            <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer ml-2">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 2-Column Body Layout matching Figma SS6 & SS8 */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          
          {/* Main Left Content Pane */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            
            {/* Title & Description */}
            <div className="space-y-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSaveTitleDesc}
                placeholder="Task title..."
                className="w-full text-2xl font-bold text-foreground bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary rounded-md px-1"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleSaveTitleDesc}
                placeholder="Create clear and detailed documentation..."
                className="w-full h-20 text-xs text-muted-foreground bg-transparent border border-border/50 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
            </div>

            {/* Properties Tags Row (Designer, Date Badge) */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground font-medium">Properties</span>
                <span className="px-2 py-0.5 rounded-md bg-muted text-foreground font-medium">A Designer</span>
                <DatePickerPopover selectedDate={dueDate} onSelectDate={handleSaveDate} />
              </div>
            </div>

            {/* Labels List */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted-foreground font-medium mr-2">Labels</span>
              {["Research", "Design", "Development", "Testing", "Deployment"].map((lbl) => (
                <span key={lbl} className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-border bg-muted/30 text-foreground font-medium">
                  <TagIcon className="h-3 w-3 text-muted-foreground" />
                  <span>{lbl}</span>
                </span>
              ))}
            </div>

            {/* Resources Link */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-muted-foreground font-medium">Resources</span>
              <button type="button" className="text-muted-foreground hover:text-foreground font-medium flex items-center space-x-1 cursor-pointer">
                <Paperclip className="h-3.5 w-3.5" />
                <span>Add document or link...</span>
              </button>
            </div>

            {/* Subtasks Progress Table matching Figma SS6 */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Subtasks</h4>
              </div>

              <div className="border border-border rounded-xl bg-card overflow-hidden text-xs">
                <div className="grid grid-cols-12 gap-2 px-3 py-2 border-b border-border bg-muted/40 font-medium text-muted-foreground">
                  <div className="col-span-5">Task</div>
                  <div className="col-span-3">Priority</div>
                  <div className="col-span-2">Members</div>
                  <div className="col-span-2">Due Date</div>
                </div>

                <div className="divide-y divide-border">
                  {subtasks.map((st) => (
                    <div key={st.id} className="grid grid-cols-12 gap-2 px-3 py-2.5 items-center hover:bg-muted/30 transition-colors">
                      <div className="col-span-5 font-medium text-foreground">{st.title}</div>
                      <div className="col-span-3">
                        <PrioritySignalIcon priority={st.priority} />
                      </div>
                      <div className="col-span-2">
                        <span className="px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-bold text-[10px]">
                          {st.assignee}
                        </span>
                      </div>
                      <div className="col-span-2 text-muted-foreground text-[11px]">{st.dueDate}</div>
                    </div>
                  ))}
                </div>

                {/* Inline Add Subtask Input */}
                <div className="p-2 border-t border-border">
                  {isAddingSubtask ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newSubtaskTitle}
                        onChange={(e) => setNewSubtaskTitle(e.target.value)}
                        placeholder="Subtask title..."
                        className="flex-1 px-2.5 py-1 text-xs border border-border rounded-lg bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                        onKeyDown={(e) => e.key === "Enter" && handleAddSubtask()}
                      />
                      <button type="button" onClick={handleAddSubtask} className="px-2.5 py-1 text-xs bg-foreground text-background rounded-lg font-medium cursor-pointer">
                        Add
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAddingSubtask(true)}
                      className="flex items-center space-x-1.5 text-xs text-muted-foreground hover:text-foreground font-medium cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Subtasks</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Comments Thread Section matching Figma SS6 */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Comments</h4>

              {/* Comment Thread List */}
              <div className="space-y-3">
                {comments.map((cm) => (
                  <div key={cm.id} className="p-3 border border-border rounded-xl bg-card space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-foreground">{cm.author}</span>
                        <span className="text-muted-foreground text-[11px]">{cm.timestamp}</span>
                      </div>
                      <button type="button" className="text-muted-foreground hover:text-foreground cursor-pointer">
                        <Smile className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-foreground">{cm.content}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment Input Box */}
              <div className="border border-border rounded-xl bg-card p-3 space-y-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full text-xs bg-transparent border-none focus:outline-none resize-none h-14"
                />
                <div className="flex items-center justify-between border-t border-border/40 pt-2">
                  <button type="button" className="text-muted-foreground hover:text-foreground p-1 cursor-pointer">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleAddComment}
                    className="p-1.5 rounded-lg bg-foreground text-background hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Details & Updates Pane matching Figma SS6 */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-border bg-card p-5 overflow-y-auto space-y-6">
            
            {/* Details Key-Value List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Details</h3>
                <button type="button" className="text-muted-foreground hover:text-foreground cursor-pointer">
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Status Select */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Status</span>
                <select
                  value={status}
                  onChange={(e) => handleSaveStatus(e.target.value)}
                  className="bg-muted border border-border rounded-lg px-2 py-1 text-xs text-foreground font-medium focus:outline-none cursor-pointer"
                >
                  <option value="TODO">Backlog / To Do</option>
                  <option value="IN_PROGRESS">Doing</option>
                  <option value="DONE">Completed</option>
                  <option value="ON_HOLD">On Hold</option>
                </select>
              </div>

              {/* Priority Selection Popover */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Priority</span>
                <PriorityPopover currentPriority={priority} onSelectPriority={handleSavePriority} />
              </div>

              {/* Members */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Members</span>
                <button type="button" className="text-muted-foreground hover:text-foreground text-xs font-medium cursor-pointer">
                  + Add members
                </button>
              </div>

              {/* Dates */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Dates</span>
                <DatePickerPopover selectedDate={dueDate} onSelectDate={handleSaveDate} />
              </div>

              {/* Labels */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Labels</span>
                <span className="text-foreground font-medium">Research, Design</span>
              </div>

              {/* Teams */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Teams</span>
                <span className="text-muted-foreground">-</span>
              </div>

              {/* Reporter */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Reporter</span>
                <span className="text-foreground font-medium">Admin</span>
              </div>
            </div>

            {/* Updates Activity Feed Section matching Figma SS6 */}
            <div className="space-y-3 pt-4 border-t border-border">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Updates</h3>
              
              <div className="space-y-2.5">
                {updates.map((up) => (
                  <div key={up.id} className="text-xs p-2.5 rounded-xl border border-border bg-muted/20 space-y-1">
                    <div className="font-semibold text-foreground">{up.user}</div>
                    <div className="text-muted-foreground text-[11px]">{up.action} · {up.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

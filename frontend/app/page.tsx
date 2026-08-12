"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "../components/layout/AppLayout";
import { useTaskStore, Task } from "../store/useTaskStore";
import { useAuthStore } from "../store/useAuthStore";
import { TaskColumn } from "../components/tasks/TaskColumn";
import { TaskList } from "../components/tasks/TaskList";
import { CreateTaskModal } from "../components/tasks/CreateTaskModal";
import { TaskDetailsModal } from "../components/tasks/TaskDetailsModal";
import { BoardDndContext } from "../components/tasks/BoardDndContext";
import { FieldsPopover, FieldsState } from "../components/tasks/FieldsPopover";
import { Filter, Search, Plus } from "lucide-react";
import { DropResult } from "@hello-pangea/dnd";

export default function Home() {
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);
  const tasks = useTaskStore((state) => state.tasks);
  const userId = useAuthStore((state) => state.userId);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  
  // Single source of truth for view mode ("board" | "list")
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  
  // Dynamic Field visibility state driven by FieldsPopover (matching SS3 & SS7)
  const [visibleFields, setVisibleFields] = useState<FieldsState>({
    priority: true,
    members: true,
    dueDate: true,
    labels: false,
    status: false,
    reporter: false,
  });

  // Reactive search state
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (isHydrated && !userId) {
      router.push("/login");
    }
  }, [isHydrated, userId, router]);

  useEffect(() => {
    if (userId) fetchTasks();
  }, [userId, fetchTasks]);

  // ⌘F / Ctrl+F keyboard shortcut to focus search input matching SS5
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggleField = (fieldKey: string) => {
    setVisibleFields((prev) => ({
      ...prev,
      [fieldKey]: !prev[fieldKey],
    }));
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // If dropped outside a valid column droppable area
    if (!destination) return;

    // If dropped in the exact same column and position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Trigger optimistic update + backend API call
    updateTaskStatus(draggableId, destination.droppableId);
  };

  // Case-insensitive title search filtering matching SS5
  const filteredTasks = tasks.filter((t) =>
    searchQuery.trim() === ""
      ? true
      : t.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  // Group filtered tasks by status
  const todoTasks = filteredTasks.filter((t) => t.status === "TODO");
  const doingTasks = filteredTasks.filter((t) => t.status === "IN_PROGRESS");
  const completedTasks = filteredTasks.filter((t) => t.status === "DONE");
  const onHoldTasks = filteredTasks.filter((t) => t.status === "ON_HOLD");

  if (!isHydrated) {
    return null; // Prevents hydration mismatch while Zustand loads from localStorage
  }

  return (
    <AppLayout>
      {/* Header Toolbar matching Figma SS2, SS3, SS4, SS5 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Search Input with ⌘F Badge matching Figma SS5 */}
          <div className="relative flex-1 sm:w-64">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-9 pr-12 py-1.5 border border-border rounded-lg bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
            />
            <span className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-[10px] text-muted-foreground/60 border border-border bg-muted px-1 rounded-sm font-mono select-none">
              ⌘F
            </span>
          </div>

          {/* Reusable Fields Popover (contains List/Board view switcher & column visibility checkboxes matching SS3/SS7) */}
          <FieldsPopover
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            visibleFields={visibleFields}
            onToggleField={handleToggleField}
          />

          {/* Filter Trigger Button */}
          <button 
            type="button" 
            className="p-1.5 border border-border rounded-lg hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
            title="Filter tasks"
          >
            <Filter className="h-4 w-4" />
          </button>

          {/* Add Task Primary Action Button matching Figma SS2 */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-foreground text-background px-3.5 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 flex items-center shadow-2xs transition-opacity cursor-pointer shrink-0"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Task
          </button>

          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="bg-destructive/10 text-destructive border border-destructive/20 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-destructive/20 transition-colors cursor-pointer shrink-0 ml-1"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Conditional View Rendering (Board vs List) */}
      {viewMode === "board" ? (
        <BoardDndContext onDragEnd={handleDragEnd}>
          <div className="flex space-x-5 overflow-x-auto pb-4 h-[calc(100vh-180px)] items-start">
            <TaskColumn title="To Do" statusId="TODO" tasks={todoTasks} onTaskClick={setSelectedTask} />
            <TaskColumn title="Doing" statusId="IN_PROGRESS" tasks={doingTasks} onTaskClick={setSelectedTask} />
            <TaskColumn title="Completed" statusId="DONE" tasks={completedTasks} onTaskClick={setSelectedTask} />
            <TaskColumn title="On Hold" statusId="ON_HOLD" tasks={onHoldTasks} onTaskClick={setSelectedTask} />
          </div>
        </BoardDndContext>
      ) : (
        <TaskList 
          tasks={filteredTasks} 
          onTaskClick={setSelectedTask} 
          visibleFields={visibleFields}
          onAddTask={() => setIsModalOpen(true)}
        />
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Task Details Modal */}
      <TaskDetailsModal 
        task={selectedTask} 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)} 
      />
    </AppLayout>
  );
}


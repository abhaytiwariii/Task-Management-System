"use client";

import { useEffect, useState, useRef, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppLayout } from "../../../components/layout/AppLayout";
import { useTaskStore, Task } from "../../../store/useTaskStore";
import { useProjectStore } from "../../../store/useProjectStore";
import { useAuthStore } from "../../../store/useAuthStore";
import { TaskColumn } from "../../../components/tasks/TaskColumn";
import { TaskList } from "../../../components/tasks/TaskList";
import { CreateTaskModal } from "../../../components/tasks/CreateTaskModal";
import { TaskDetailsModal } from "../../../components/tasks/TaskDetailsModal";
import { BoardDndContext } from "../../../components/tasks/BoardDndContext";
import { FieldsPopover, FieldsState } from "../../../components/tasks/FieldsPopover";
import { Search, Filter, Plus, ChevronRight } from "lucide-react";
import { DropResult } from "@hello-pangea/dnd";

export default function ProjectTaskPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);
  const tasks = useTaskStore((state) => state.tasks);
  const fetchProjects = useProjectStore((state) => state.fetchProjects);
  const projects = useProjectStore((state) => state.projects);

  const userId = useAuthStore((state) => state.userId);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const router = useRouter();

  const [viewMode, setViewMode] = useState<"board" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [visibleFields, setVisibleFields] = useState<FieldsState>({
    priority: true,
    members: true,
    dueDate: true,
    labels: false,
    status: false,
    reporter: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Find project details
  const currentProject = projects.find((p) => p.id === projectId);

  useEffect(() => {
    if (isHydrated && !userId) {
      router.push("/login");
    }
  }, [isHydrated, userId, router]);

  useEffect(() => {
    if (userId) {
      fetchProjects();
      fetchTasks(projectId);
    }
  }, [userId, projectId, fetchProjects, fetchTasks]);

  // ⌘F / Ctrl+F search shortcut
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
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    updateTaskStatus(draggableId, destination.droppableId);
  };

  // Filter tasks by project and search query
  const filteredTasks = tasks.filter((t) =>
    searchQuery.trim() === ""
      ? true
      : t.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const todoTasks = filteredTasks.filter((t) => t.status === "TODO");
  const doingTasks = filteredTasks.filter((t) => t.status === "IN_PROGRESS");
  const completedTasks = filteredTasks.filter((t) => t.status === "DONE");
  const onHoldTasks = filteredTasks.filter((t) => t.status === "ON_HOLD");

  if (!isHydrated) return null;

  return (
    <AppLayout>
      {/* Breadcrumb Navigation matching Figma SS12 */}
      <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-4">
        <Link href="/projects" className="hover:text-foreground transition-colors cursor-pointer">
          Projects
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-semibold text-foreground">
          {currentProject ? currentProject.name : "Design Homepage"}
        </span>
      </div>

      {/* Header Toolbar matching Figma SS12 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Search Input */}
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

          {/* Fields Popover matching SS12 */}
          <FieldsPopover
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            visibleFields={visibleFields}
            onToggleField={handleToggleField}
          />

          {/* Filter Button */}
          <button
            type="button"
            className="p-1.5 border border-border rounded-lg hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
            title="Filter tasks"
          >
            <Filter className="h-4 w-4" />
          </button>

          {/* Add Task Button (Automatically sets current projectId) */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-foreground text-background px-3.5 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 flex items-center shadow-2xs transition-opacity cursor-pointer shrink-0"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            Add Task
          </button>
        </div>
      </div>

      {/* View Mode Component (List / Board) matching SS12 */}
      {viewMode === "board" ? (
        <BoardDndContext onDragEnd={handleDragEnd}>
          <div className="flex space-x-5 overflow-x-auto pb-4 h-[calc(100vh-200px)] items-start">
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

      {/* Create Task Modal with pre-associated projectId */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultProjectId={projectId}
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

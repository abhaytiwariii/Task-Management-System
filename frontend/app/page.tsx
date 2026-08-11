"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "../components/layout/AppLayout";
import { useTaskStore, Task } from "../store/useTaskStore";
import { useAuthStore } from "../store/useAuthStore";
import { TaskColumn } from "../components/tasks/TaskColumn";
import { TaskList } from "../components/tasks/TaskList";
import { CreateTaskModal } from "../components/tasks/CreateTaskModal";
import { TaskDetailsModal } from "../components/tasks/TaskDetailsModal";
import { BoardDndContext } from "../components/tasks/BoardDndContext";
import { LayoutGrid, List as ListIcon, Filter, Search, Plus } from "lucide-react";
import { DropResult } from "@hello-pangea/dnd";

export default function Home() {
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);
  const tasks = useTaskStore((state) => state.tasks);
  const userId = useAuthStore((state) => state.userId);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  
  // New state for view mode
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
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

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // If dropped outside a valid valid column droppable area
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

  // Group tasks by status
  const todoTasks = tasks.filter((t) => t.status === "TODO");
  const doingTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
  const completedTasks = tasks.filter((t) => t.status === "DONE");
  const onHoldTasks = tasks.filter((t) => t.status === "ON_HOLD");

  if (!isHydrated) {
    return null; // Prevents hydration mismatch while Zustand loads from localStorage
  }

  return (
    <AppLayout>
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative hidden md:block">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* View Toggle Buttons */}
          <div className="flex bg-muted p-1 rounded-lg border border-border">
            <button 
              onClick={() => setViewMode("board")}
              className={`px-3 py-1 rounded-md text-sm font-medium flex items-center transition-colors cursor-pointer ${
                viewMode === "board" 
                  ? "bg-background shadow-sm text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Board
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded-md text-sm font-medium flex items-center transition-colors cursor-pointer ${
                viewMode === "list" 
                  ? "bg-background shadow-sm text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ListIcon className="h-4 w-4 mr-2" />
              List
            </button>
          </div>

          <button className="p-2 border border-border rounded-lg hover:bg-muted text-muted-foreground">
            <Filter className="h-4 w-4" />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 flex items-center cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </button>

          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 flex items-center cursor-pointer border border-border"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Conditional Rendering based on viewMode */}
      {viewMode === "board" ? (
        <BoardDndContext onDragEnd={handleDragEnd}>
          <div className="flex space-x-6 overflow-x-auto pb-4 h-[calc(100vh-180px)] items-start">
            <TaskColumn title="To Do" statusId="TODO" tasks={todoTasks} onTaskClick={setSelectedTask} />
            <TaskColumn title="Doing" statusId="IN_PROGRESS" tasks={doingTasks} onTaskClick={setSelectedTask} />
            <TaskColumn title="Completed" statusId="DONE" tasks={completedTasks} onTaskClick={setSelectedTask} />
            <TaskColumn title="On Hold" statusId="ON_HOLD" tasks={onHoldTasks} onTaskClick={setSelectedTask} />
          </div>
        </BoardDndContext>
      ) : (
        <TaskList tasks={tasks} onTaskClick={setSelectedTask} />
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

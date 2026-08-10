"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { useTaskStore } from "../store/useTaskStore";
import { useAuthStore } from "../store/useAuthStore";
import { TaskColumn } from "../components/tasks/TaskColumn";
import { CreateTaskModal } from "../components/tasks/CreateTaskModal";
import { LayoutGrid, List as ListIcon, Filter, Search, Plus } from "lucide-react";

export default function Home() {
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const tasks = useTaskStore((state) => state.tasks);
  const userId = useAuthStore((state) => state.userId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (userId) fetchTasks();
  }, [userId, fetchTasks]);

  // Group tasks by status
  const todoTasks = tasks.filter((t) => t.status === "TODO");
  const doingTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
  const completedTasks = tasks.filter((t) => t.status === "DONE");
  const onHoldTasks = tasks.filter((t) => t.status === "ON_HOLD");

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

          <div className="flex bg-muted p-1 rounded-lg border border-border">
            <button className="px-3 py-1 bg-background shadow-sm rounded-md text-sm font-medium flex items-center">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Board
            </button>
            <button className="px-3 py-1 text-muted-foreground rounded-md text-sm font-medium flex items-center hover:text-foreground">
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
        </div>
      </div>

      {/* Kanban Board Layout */}
      <div className="flex space-x-6 overflow-x-auto pb-4 h-[calc(100vh-180px)] items-start">
        <TaskColumn title="To Do" tasks={todoTasks} />
        <TaskColumn title="Doing" tasks={doingTasks} />
        <TaskColumn title="Completed" tasks={completedTasks} />
        <TaskColumn title="On Hold" tasks={onHoldTasks} />
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </AppLayout>
  );
}





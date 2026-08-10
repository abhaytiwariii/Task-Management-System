"use client";

import { useEffect } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { useTaskStore } from "../store/useTaskStore";
import { useAuthStore } from "../store/useAuthStore";

export default function Home() {
  const fetchTasks = useTaskStore((state) => state.fetchTasks);
  const tasks = useTaskStore((state) => state.tasks);
  const userId = useAuthStore((state) => state.userId);

  useEffect(() => {
    // Only fetch tasks once we have a valid guest user ID
    if (userId) {
      fetchTasks();
    }
  }, [userId, fetchTasks]);

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold tracking-tight">My Tasks</h1>
        <button className="bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium px-4 py-2 rounded-md text-sm cursor-pointer">
          + Add Task
        </button>
      </div>

      {/* Task Board Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <h2 className="font-semibold text-lg mb-3">To Do</h2>
          <pre className="text-xs bg-muted p-2 rounded overflow-x-auto text-muted-foreground">
            {JSON.stringify(tasks, null, 2)}
          </pre>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <h2 className="font-semibold text-lg mb-3">In Progress</h2>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <h2 className="font-semibold text-lg mb-3">Done</h2>
        </div>
      </div>
    </AppLayout>
  );
}



import { useState } from "react";
import { ChevronDown, ChevronRight, MoreHorizontal, Plus } from "lucide-react";
import { Task } from "../../store/useTaskStore";

// Mock helper to simulate the signal icon shown in Figma
const PriorityBadge = ({ priority }: { priority: string | null }) => {
  if (!priority) return <span className="text-muted-foreground">-</span>;
  
  let color = "text-muted-foreground";
  if (priority === "High" || priority === "Urgent") color = "text-red-500";
  if (priority === "Medium") color = "text-orange-500";
  
  return (
    <div className={`flex items-center space-x-1 ${color} text-xs font-medium`}>
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
        {/* Simple mock signal bars */}
        <rect x="2" y="16" width="4" height="6" />
        <rect x="9" y="10" width="4" height="12" />
        <rect x="16" y="4" width="4" height="18" />
      </svg>
      <span>{priority}</span>
    </div>
  );
};

const formatDate = (isoString: string | null) => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); // e.g., 12 Sep 2026
};

// Sub-component for the collapsible groups
const TaskGroup = ({ title, tasks, onTaskClick }: { title: string; tasks: Task[], onTaskClick: (task: Task) => void }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mb-6">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center space-x-2 text-foreground font-semibold text-sm mb-3 hover:text-muted-foreground transition-colors cursor-pointer"
      >
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        <span>{title}</span>
      </button>

      {isOpen && (
        <div className="border border-border rounded-lg bg-card overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-3 border-b border-border bg-muted/30 text-xs font-medium text-muted-foreground">
            <div className="col-span-6">Task</div>
            <div className="col-span-2">Priority</div>
            <div className="col-span-2">Members</div>
            <div className="col-span-1">Due Date</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          
          <div className="divide-y divide-border">
            {tasks.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">No tasks in this list.</div>
            ) : (
              tasks.map(task => (
                <div 
                  key={task.id} 
                  onClick={() => onTaskClick(task)}
                  className="grid grid-cols-12 gap-4 p-3 items-center hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <div className="col-span-6 text-sm font-medium text-foreground truncate">
                    {task.title}
                  </div>
                  <div className="col-span-2">
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <div className="col-span-2 flex items-center">
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-primary-foreground font-bold">
                      {task.assignee ? task.assignee.charAt(0).toUpperCase() : 'U'}
                    </div>
                  </div>
                  <div className="col-span-1 text-xs text-muted-foreground">
                    {formatDate(task.dueDate)}
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button className="text-muted-foreground hover:text-foreground cursor-pointer">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
            
            {/* The inline add task button seen in Figma */}
            <div className="p-3">
               <button className="flex items-center text-xs text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer">
                 <Plus className="h-3 w-3 mr-1" />
                 Add Task
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export function TaskList({ tasks, onTaskClick }: { tasks: Task[], onTaskClick: (task: Task) => void }) {
  const todoTasks = tasks.filter(t => t.status === "TODO");
  const doingTasks = tasks.filter(t => t.status === "IN_PROGRESS");
  const completedTasks = tasks.filter(t => t.status === "DONE");
  const onHoldTasks = tasks.filter(t => t.status === "ON_HOLD");

  return (
    <div className="flex flex-col w-full overflow-y-auto pr-2 pb-4 h-[calc(100vh-180px)]">
      <TaskGroup title="To Do" tasks={todoTasks} onTaskClick={onTaskClick} />
      <TaskGroup title="Doing" tasks={doingTasks} onTaskClick={onTaskClick} />
      <TaskGroup title="Completed" tasks={completedTasks} onTaskClick={onTaskClick} />
      <TaskGroup title="On Hold" tasks={onHoldTasks} onTaskClick={onTaskClick} />
    </div>
  );
}

import { useState } from "react";
import { ChevronDown, ChevronRight, MoreHorizontal, Plus } from "lucide-react";
import { Task } from "../../store/useTaskStore";
import { PrioritySignalIcon } from "./PrioritySignalIcon";
import { FieldsState } from "./FieldsPopover";

const formatDate = (isoString: string | null) => {
  if (!isoString) return "-";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); // e.g., 12 Sep 2026
};

interface TaskGroupProps {
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  visibleFields: FieldsState;
  onAddTask?: () => void;
}

const TaskGroup = ({ title, tasks, onTaskClick, visibleFields, onAddTask }: TaskGroupProps) => {
  const [isOpen, setIsOpen] = useState(true);

  // Dynamic grid column calculation based on active visible fields
  const showPriority = visibleFields.priority;
  const showMembers = visibleFields.members;
  const showDueDate = visibleFields.dueDate;
  const showLabels = visibleFields.labels;

  return (
    <div className="mb-6">
      {/* Collapsible Group Header matching Figma */}
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center space-x-2 text-foreground font-semibold text-sm mb-3 hover:text-muted-foreground transition-colors cursor-pointer"
      >
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        <span>{title}</span>
        <span className="text-xs font-normal text-muted-foreground ml-1">({tasks.length})</span>
      </button>

      {isOpen && (
        <div className="border border-border rounded-xl bg-card overflow-hidden shadow-2xs">
          {/* Header Row with Dynamic Field Columns matching Figma SS4 & SS7 */}
          <div className="flex items-center gap-4 px-4 py-2.5 border-b border-border bg-muted/40 text-xs font-medium text-muted-foreground">
            <div className="flex-1 min-w-[200px]">Task</div>
            
            {showPriority && <div className="w-28 shrink-0">Priority</div>}
            {showMembers && <div className="w-24 shrink-0">Members</div>}
            {showDueDate && <div className="w-28 shrink-0">Due Date</div>}
            {showLabels && <div className="w-32 shrink-0">Labels</div>}
            
            <div className="w-12 text-right shrink-0">Actions</div>
          </div>
          
          <div className="divide-y divide-border">
            {tasks.length === 0 ? (
              <div className="p-4 text-xs text-muted-foreground text-center">No tasks in this list.</div>
            ) : (
              tasks.map((task) => (
                <div 
                  key={task.id} 
                  onClick={() => onTaskClick(task)}
                  className="flex items-center gap-4 px-4 py-3 text-xs hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  {/* Task Title */}
                  <div className="flex-1 min-w-[200px] font-medium text-foreground truncate">
                    {task.title}
                  </div>

                  {/* Priority Column */}
                  {showPriority && (
                    <div className="w-28 shrink-0">
                      <PrioritySignalIcon priority={task.priority} />
                    </div>
                  )}

                  {/* Members Column */}
                  {showMembers && (
                    <div className="w-24 shrink-0 flex items-center">
                      <div className="h-6 w-6 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center text-[10px] font-bold">
                        {task.assignee ? task.assignee.charAt(0).toUpperCase() : "U"}
                      </div>
                    </div>
                  )}

                  {/* Due Date Column */}
                  {showDueDate && (
                    <div className="w-28 shrink-0 text-muted-foreground">
                      {formatDate(task.dueDate)}
                    </div>
                  )}

                  {/* Labels Column */}
                  {showLabels && (
                    <div className="w-32 shrink-0 flex flex-wrap gap-1">
                      {task.labels && task.labels.length > 0 ? (
                        task.labels.map((lbl, idx) => (
                          <span key={idx} className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded-md text-[10px]">
                            {lbl}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground/50">-</span>
                      )}
                    </div>
                  )}

                  {/* Actions Column */}
                  <div className="w-12 flex justify-end shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button 
                      type="button" 
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
            
            {/* Inline "+ Add Task" row matching Figma SS4 */}
            <div className="px-4 py-2.5">
              <button 
                type="button"
                onClick={onAddTask}
                className="flex items-center text-xs text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                <span>Add Task</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export function TaskList({
  tasks,
  onTaskClick,
  visibleFields,
  onAddTask,
}: {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  visibleFields: FieldsState;
  onAddTask?: () => void;
}) {
  const todoTasks = tasks.filter((t) => t.status === "TODO");
  const doingTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
  const completedTasks = tasks.filter((t) => t.status === "DONE");
  const onHoldTasks = tasks.filter((t) => t.status === "ON_HOLD");

  return (
    <div className="flex flex-col w-full overflow-y-auto pr-2 pb-4 h-[calc(100vh-180px)]">
      <TaskGroup title="To Do" tasks={todoTasks} onTaskClick={onTaskClick} visibleFields={visibleFields} onAddTask={onAddTask} />
      <TaskGroup title="Doing" tasks={doingTasks} onTaskClick={onTaskClick} visibleFields={visibleFields} onAddTask={onAddTask} />
      <TaskGroup title="Completed" tasks={completedTasks} onTaskClick={onTaskClick} visibleFields={visibleFields} onAddTask={onAddTask} />
      <TaskGroup title="On Hold" tasks={onHoldTasks} onTaskClick={onTaskClick} visibleFields={visibleFields} onAddTask={onAddTask} />
    </div>
  );
}

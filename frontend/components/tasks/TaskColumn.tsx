import { Plus, MoreHorizontal, GripVertical } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { Task } from "../../store/useTaskStore";
import { Droppable } from "@hello-pangea/dnd";

interface TaskColumnProps {
  title: string;
  statusId: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask?: (statusId: string) => void;
}

export function TaskColumn({ title, statusId, tasks, onTaskClick, onAddTask }: TaskColumnProps) {
  return (
    <section className="flex flex-col w-[340px] shrink-0 rounded-[10px] border border-border bg-muted/50 px-2.5 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <header className="flex items-center justify-between px-2.5 pb-3.5">
        <div className="flex items-center gap-3">
          <GripVertical className="size-5 text-muted-foreground cursor-grab" strokeWidth={2.5} />
          <h2 className="text-[17px] font-semibold text-foreground">{title}</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Add task"
            onClick={() => onAddTask?.(statusId)}
            className="text-muted-foreground transition-opacity hover:opacity-60 cursor-pointer"
          >
            <Plus className="size-5" strokeWidth={2.5} />
          </button>
          <button type="button" aria-label="More list options" className="text-muted-foreground transition-opacity hover:opacity-60 cursor-pointer">
            <MoreHorizontal className="size-5" strokeWidth={2.5} />
          </button>
        </div>
      </header>

      <Droppable droppableId={statusId}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-col space-y-3 flex-1 overflow-y-auto min-h-[150px]"
          >
            {tasks.map((task, index) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                index={index} 
                onClick={() => onTaskClick(task)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <button
        type="button"
        onClick={() => onAddTask?.(statusId)}
        className="mt-3 flex items-center gap-2 px-2.5 pt-0.5 text-[16px] font-medium text-foreground transition-opacity hover:opacity-60 cursor-pointer"
      >
        <Plus className="size-[18px]" strokeWidth={2.5} />
        Add Task
      </button>
    </section>
  );
}

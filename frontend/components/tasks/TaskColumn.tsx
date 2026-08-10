import { Plus, MoreHorizontal } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { Task } from "../../store/useTaskStore";
import { Droppable } from "@hello-pangea/dnd";

interface TaskColumnProps {
  title: string;
  statusId: string;
  tasks: Task[];
}

export function TaskColumn({ title, statusId, tasks }: TaskColumnProps) {
  return (
    <div className="flex flex-col w-[340px] shrink-0 p-1">
      <div className="flex justify-between items-center mb-4 px-1">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground/50 text-base cursor-grab">⋮⋮</span>

          <h2 className="font-semibold text-sm text-foreground">{title}</h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
        <div className="flex space-x-1">
          <button className="text-muted-foreground hover:text-foreground p-1">
            <Plus className="h-4 w-4" />
          </button>
          <button className="text-muted-foreground hover:text-foreground p-1">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Droppable droppableId={statusId}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-col space-y-3 flex-1 overflow-y-auto min-h-[150px]"
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <button className="mt-3 flex items-center text-muted-foreground hover:text-foreground text-sm py-2 px-1 transition-colors w-full cursor-pointer">
        <Plus className="h-4 w-4 mr-2" />
        Add Task
      </button>
    </div>
  );
}

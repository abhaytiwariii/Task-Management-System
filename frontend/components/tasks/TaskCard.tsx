import { MoreHorizontal, Calendar, Tag } from "lucide-react";
import Image from "next/image";
import { Task } from "../../store/useTaskStore";
import { Draggable } from "@hello-pangea/dnd";

interface TaskCardProps {
  task: Task;
  index: number;
  onClick: () => void;
}

export function TaskCard({ task, index, onClick }: TaskCardProps) {
  // Mocks for data we haven't added to the DB yet
  const mockDueDate = task.dueDate || "12 Sep 2026";
  const mockRole = "Admin";
  const mockLabel = task.labels?.[0] || "Deployment";

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group flex flex-col gap-3 ${
            snapshot.isDragging ? "shadow-lg opacity-80 rotate-2" : ""
          }`}
          style={{ ...provided.draggableProps.style }}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-foreground text-[15px] leading-snug line-clamp-2 pr-4">
              {task.title}
            </h3>
            <button className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity p-1 -mr-2 -mt-1">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Avatar Placeholder */}
              <Image
                src="https://api.dicebear.com/7.x/notionists/svg?seed=Admin&backgroundColor=f43f5e"
                alt="Admin"
                width={24}
                height={24}
                className="w-6 h-6 rounded-full border border-border bg-primary"
              />
              <span className="text-xs font-medium text-foreground">{mockRole}</span>
            </div>

            {/* Date Badge */}
            <div className="flex items-center gap-1.5 bg-[var(--priority-high-bg)] text-[var(--priority-high-fg)] px-2 py-1 rounded-md text-[11px] font-medium border border-[var(--priority-high-bg)]/20">
              <Calendar className="h-3 w-3" />
              <span>{mockDueDate}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Label Badge */}
            <div className="flex items-center gap-1.5 border border-border px-2.5 py-1 rounded-md text-[11px] text-muted-foreground font-medium">
              <Tag className="h-3 w-3" />
              <span>{mockLabel}</span>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

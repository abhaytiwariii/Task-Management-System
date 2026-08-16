import { MoreHorizontal, CalendarDays, Tag } from "lucide-react";
import Image from "next/image";
import { Task } from "../../store/useTaskStore";
import { Draggable } from "@hello-pangea/dnd";
import { formatDate } from "@/utils/formatDate";

interface TaskCardProps {
  task: Task;
  index: number;
  onClick: () => void;
}

export function TaskCard({ task, index, onClick }: TaskCardProps) {
  // Mocks for data we haven't added to the DB yet
  const dueDate =
    task.dueDate && formatDate(task.dueDate, "dayMonth")
      ? formatDate(task.dueDate, "dayMonth")
      : "29 Jul";
  const mockRole = "Admin";
  // The Figma screenshot shows two tags sometimes, e.g. "Deployment", "Deployment"
  const mockLabels = task.labels?.length
    ? task.labels
    : ["Deployment", "Deployment"];

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <article
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onClick}
          className={`rounded-[11px] border border-border bg-card px-4 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] cursor-pointer transition-shadow hover:shadow-md ${
            snapshot.isDragging ? "shadow-lg opacity-80 rotate-2" : ""
          }`}
          style={{ ...provided.draggableProps.style }}
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[19px] font-medium leading-6 tracking-[-0.02em] text-foreground pr-4 line-clamp-2">
              {task.title}
            </h3>
            <button
              type="button"
              aria-label={`More options for ${task.title}`}
              className="mt-0.5 shrink-0 text-muted-foreground transition-opacity hover:opacity-60"
            >
              <MoreHorizontal className="size-[19px]" strokeWidth={2.2} />
            </button>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-[16px] text-foreground">
              <div
                className="flex size-6 items-center justify-center overflow-hidden rounded-full border border-border bg-muted"
                aria-hidden="true"
              >
                <Image
                  src="https://api.dicebear.com/7.x/notionists/svg?seed=Admin&backgroundColor=f43f5e"
                  alt="Admin"
                  width={24}
                  height={24}
                  className="w-full h-full"
                />
              </div>
              <span>{mockRole}</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-badge-date-bg px-3 py-1 text-[15px] font-medium text-badge-date-fg">
              <CalendarDays className="size-4" strokeWidth={2} />
              <span>{dueDate}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {mockLabels.map((tag, i) => (
              <span
                key={`${tag}-${i}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-[16px] leading-5 text-foreground"
              >
                <Tag className="size-[16px]" strokeWidth={2.2} />
                {tag}
              </span>
            ))}
          </div>
        </article>
      )}
    </Draggable>
  );
}

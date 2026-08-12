import React from "react";

export type PriorityLevel = "Urgent" | "High" | "Medium" | "Low" | "No Priority" | string | null;

interface PrioritySignalIconProps {
  priority: PriorityLevel;
  showLabel?: boolean;
  className?: string;
}

export const PrioritySignalIcon: React.FC<PrioritySignalIconProps> = ({
  priority,
  showLabel = true,
  className = "",
}) => {
  const normPriority = (priority || "").trim();

  // Color mapping matching Figma 
  // Urgent / High: Red (#EF4444)
  // Medium: Orange (#F97316)
  // Low: Gray (#9CA3AF)
  // No Priority: Light Gray (#D1D5DB)

  const renderSignalBars = () => {
    switch (normPriority) {
      case "Urgent":
        return (
          <div className="flex items-end space-x-[2px] h-3.5 w-3.5 justify-center text-red-500" title="Urgent">
            <span className="w-[2.5px] h-1.5 bg-current rounded-xs" />
            <span className="w-[2.5px] h-2.5 bg-current rounded-xs" />
            <span className="w-[2.5px] h-3.5 bg-current rounded-xs" />
          </div>
        );
      case "High":
        return (
          <div className="flex items-end space-x-[2px] h-3.5 w-3.5 justify-center text-red-500" title="High">
            <span className="w-[2.5px] h-1.5 bg-current rounded-xs" />
            <span className="w-[2.5px] h-2.5 bg-current rounded-xs" />
            <span className="w-[2.5px] h-3.5 bg-current rounded-xs" />
          </div>
        );
      case "Medium":
        return (
          <div className="flex items-end space-x-[2px] h-3.5 w-3.5 justify-center text-orange-500" title="Medium">
            <span className="w-[2.5px] h-1.5 bg-current rounded-xs" />
            <span className="w-[2.5px] h-2.5 bg-current rounded-xs" />
            <span className="w-[2.5px] h-3.5 bg-muted-foreground/30 rounded-xs" />
          </div>
        );
      case "Low":
        return (
          <div className="flex items-end space-x-[2px] h-3.5 w-3.5 justify-center text-muted-foreground" title="Low">
            <span className="w-[2.5px] h-1.5 bg-current rounded-xs" />
            <span className="w-[2.5px] h-2.5 bg-muted-foreground/30 rounded-xs" />
            <span className="w-[2.5px] h-3.5 bg-muted-foreground/30 rounded-xs" />
          </div>
        );
      case "No Priority":
      default:
        return (
          <div className="flex items-end space-x-[2px] h-3.5 w-3.5 justify-center text-muted-foreground/40" title="No Priority">
            <span className="w-[2.5px] h-1.5 bg-current rounded-xs" />
            <span className="w-[2.5px] h-2.5 bg-current rounded-xs" />
            <span className="w-[2.5px] h-3.5 bg-current rounded-xs" />
          </div>
        );
    }
  };

  const getTextColor = () => {
    switch (normPriority) {
      case "Urgent":
      case "High":
        return "text-red-500 font-medium";
      case "Medium":
        return "text-orange-500 font-medium";
      case "Low":
        return "text-muted-foreground font-normal";
      default:
        return "text-muted-foreground/60 font-normal";
    }
  };

  return (
    <div className={`inline-flex items-center space-x-1.5 ${className}`}>
      {renderSignalBars()}
      {showLabel && (
        <span className={`text-xs ${getTextColor()}`}>
          {normPriority || "No Priority"}
        </span>
      )}
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { X, Calendar as CalendarIcon, ChevronDown, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useTaskStore } from "../../store/useTaskStore";
import { PrioritySignalIcon, PriorityLevel } from "./PrioritySignalIcon";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStatus?: string;
  defaultProjectId?: string;
}

const PRIORITIES: PriorityLevel[] = ["No Priority", "Urgent", "High", "Medium", "Low"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function CreateTaskModal({
  isOpen,
  onClose,
  defaultStatus = "TODO",
  defaultProjectId,
}: CreateTaskModalProps) {
  const addTask = useTaskStore((state) => state.addTask);
  
  // State initialization
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<PriorityLevel>("Medium");
  
  // Default date set to TODAY
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  // Dropdown / Popover Visibility States
  const [isPriorityOpen, setIsPriorityOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Calendar Navigation State
  const [calendarYear, setCalendarYear] = useState<number>(() => selectedDate.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState<number>(() => selectedDate.getMonth());

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addTask({
      title: title.trim(),
      status: defaultStatus,
      priority,
      dueDate: selectedDate ? selectedDate.toISOString() : new Date().toISOString(),
      labels: ["Design"],
      assignee: "Guest User",
      projectId: defaultProjectId || undefined,
    });

    setTitle("");
    setPriority("Medium");
    setSelectedDate(new Date());
    onClose();
  };

  // Calendar Logic
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();

  const calendarCells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(d);
  }

  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((y) => y - 1);
    } else {
      setCalendarMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((y) => y + 1);
    } else {
      setCalendarMonth((m) => m + 1);
    }
  };

  const formatDisplayDate = (d: Date) => {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-50">
      <div className="w-full max-w-md rounded-2xl border border-border bg-popover text-popover-foreground p-6 shadow-2xl space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Create New Task</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-muted-foreground">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-xs"
              placeholder="E.g., Design Homepage"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Theme-Aware Custom Priority Selector Popover */}
            <div className="space-y-1.5 relative">
              <label className="block text-xs font-medium text-muted-foreground">
                Priority
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsPriorityOpen(!isPriorityOpen);
                  setIsDatePickerOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <PrioritySignalIcon priority={priority} showLabel={true} />
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-1" />
              </button>

              {/* Priority Menu */}
              {isPriorityOpen && (
                <div className="absolute left-0 mt-1 w-full rounded-xl border border-border bg-popover text-popover-foreground shadow-xl z-50 p-1.5 space-y-0.5 animate-in fade-in-50 zoom-in-95">
                  {PRIORITIES.map((p) => {
                    const isSelected = priority === p;
                    return (
                      <div
                        key={p}
                        onClick={() => {
                          setPriority(p);
                          setIsPriorityOpen(false);
                        }}
                        className="flex items-center justify-between px-2.5 py-1.5 text-xs rounded-lg hover:bg-muted transition-colors cursor-pointer"
                      >
                        <PrioritySignalIcon priority={p} showLabel={true} />
                        {isSelected && <Check className="h-3.5 w-3.5 text-foreground stroke-[2.5]" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Theme-Aware Custom Date Picker Popover (Default: Today) */}
            <div className="space-y-1.5 relative">
              <label className="block text-xs font-medium text-muted-foreground">
                Due Date
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsDatePickerOpen(!isDatePickerOpen);
                  setIsPriorityOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-1.5 truncate">
                  <CalendarIcon className="h-3.5 w-3.5 text-red-500" />
                  <span>{formatDisplayDate(selectedDate)}</span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-1 shrink-0" />
              </button>

              {/* Calendar Dropdown */}
              {isDatePickerOpen && (
                <div className="absolute right-0 mt-1 w-64 rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl z-50 p-3 animate-in fade-in-50 zoom-in-95">
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <button
                      type="button"
                      onClick={prevMonth}
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-xs font-semibold text-foreground">
                      {MONTH_NAMES[calendarMonth]} {calendarYear}
                    </span>
                    <button
                      type="button"
                      onClick={nextMonth}
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Day Headers */}
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-muted-foreground mb-1">
                    {DAYS_OF_WEEK.map((d) => (
                      <div key={d} className="py-1">{d}</div>
                    ))}
                  </div>

                  {/* Days Matrix */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {calendarCells.map((day, idx) => {
                      if (day === null) {
                        return <div key={`empty-${idx}`} className="p-1.5" />;
                      }

                      const isSelected =
                        selectedDate.getDate() === day &&
                        selectedDate.getMonth() === calendarMonth &&
                        selectedDate.getFullYear() === calendarYear;

                      const isToday =
                        new Date().getDate() === day &&
                        new Date().getMonth() === calendarMonth &&
                        new Date().getFullYear() === calendarYear;

                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            setSelectedDate(new Date(calendarYear, calendarMonth, day));
                            setIsDatePickerOpen(false);
                          }}
                          className={`p-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? "bg-foreground text-background font-bold shadow-xs"
                              : isToday
                              ? "border border-primary text-primary font-semibold"
                              : "text-foreground hover:bg-muted"
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  {/* Calendar Quick Footer */}
                  <div className="flex items-center justify-between border-t border-border mt-3 pt-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date();
                        setSelectedDate(today);
                        setCalendarMonth(today.getMonth());
                        setCalendarYear(today.getFullYear());
                        setIsDatePickerOpen(false);
                      }}
                      className="text-primary hover:underline font-medium cursor-pointer"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsDatePickerOpen(false)}
                      className="text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium bg-foreground text-background hover:opacity-90 rounded-xl transition-opacity cursor-pointer shadow-xs font-semibold"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


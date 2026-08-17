"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

interface CustomDatePickerProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  placeholder?: string;
  className?: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selectedDate,
  onSelectDate,
  placeholder = "Select Date",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const activeDate = selectedDate || new Date();
  const [calendarYear, setCalendarYear] = useState<number>(activeDate.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState<number>(activeDate.getMonth());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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

  const formatDisplayDate = (d: Date | null) => {
    if (!d) return placeholder;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="relative inline-block w-full text-left" ref={popoverRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border border-border bg-background text-foreground text-xs hover:bg-muted/50 transition-colors cursor-pointer ${className}`}
      >
        <div className="flex items-center space-x-2 truncate">
          <CalendarIcon className="h-3.5 w-3.5 text-red-500 shrink-0" />
          <span>{formatDisplayDate(selectedDate)}</span>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-1 shrink-0" />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-1 w-64 rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl z-50 p-3 animate-in fade-in-50 zoom-in-95">
          {/* Header Navigation */}
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

          {/* Days Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-muted-foreground mb-1">
            {DAYS_OF_WEEK.map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>

          {/* Day Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {calendarCells.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="p-1.5" />;
              }

              const isSelected =
                selectedDate &&
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
                    onSelectDate(new Date(calendarYear, calendarMonth, day));
                    setIsOpen(false);
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

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-border mt-3 pt-2 text-[11px]">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                onSelectDate(today);
                setCalendarMonth(today.getMonth());
                setCalendarYear(today.getFullYear());
                setIsOpen(false);
              }}
              className="text-primary hover:underline font-medium cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

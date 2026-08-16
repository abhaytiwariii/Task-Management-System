type DateFormat = "date" | "dateTime" | "dayMonth" | "dayMonthYear" | "time";

export function formatDate(
  dateString?: string | null,
  format: DateFormat = "date",
) {
  if (!dateString) {
    return null;
  }
  const date = new Date(dateString);

  const formats: Record<DateFormat, Intl.DateTimeFormatOptions> = {
    date: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
    dateTime: {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
    dayMonth: {
      day: "numeric",
      month: "short",
    },
    dayMonthYear: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
    time: {
      hour: "numeric",
      minute: "2-digit",
    },
  };

  return date.toLocaleDateString("en-GB", formats[format]);
}

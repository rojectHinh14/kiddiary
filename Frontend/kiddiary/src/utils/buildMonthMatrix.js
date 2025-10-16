import {
  addMonths, addYears, format, isSameDay, isSameMonth, startOfMonth,
  endOfMonth, startOfWeek, endOfWeek, addDays, isToday, parseISO
} from "date-fns";
export function buildMonthMatrix(current) {
  const start = startOfWeek(startOfMonth(current), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(current), { weekStartsOn: 0 });

  const weeks = [];
  let day = start;
  while (day <= end) {
    const w = [];
    for (let i = 0; i < 7; i++) {
      w.push(day);
      day = addDays(day, 1);
    }
    weeks.push(w);
  }
  return weeks;
}
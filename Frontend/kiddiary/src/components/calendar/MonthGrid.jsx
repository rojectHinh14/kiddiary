import { useState, useMemo, useEffect } from "react";
import { format, isSameDay, isSameMonth, isToday } from "date-fns";
import DayCell from "./DayCell";
import DayMomentsModal from "./DayMomentsModal";

export default function MonthGrid({
  current,
  matrix,
  grouped,
  selectedDate,
  onSelect,
  onAddMoment,
  onUpdateMoment,     // optional
  onDeleteMoment,     // optional
}) {
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const [openDate, setOpenDate] = useState(null);

  // (tuỳ chọn) ESC để đóng
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpenDate(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openItems = useMemo(() => {
    if (!openDate) return [];
    const key = format(openDate, "yyyy-MM-dd");
    return grouped[key] || [];
  }, [openDate, grouped]);

  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm border border-black/5">
      {/* header weekday */}
      <div className="grid grid-cols-7 text-center text-xs text-gray-500 pb-2">
        {dayNames.map((d) => <div key={d} className="py-1">{d}</div>)}
      </div>

      {/* weeks */}
      <div className="grid grid-cols-7 gap-2">
        {matrix.map((week, wi) =>
          week.map((day, di) => {
            const key = format(day, "yyyy-MM-dd");
            const items = grouped[key] || [];
            const inMonth = isSameMonth(day, current);
            const isSel = selectedDate && isSameDay(day, selectedDate);

            return (
              <DayCell
                key={`${wi}-${di}`}
                date={day}
                inMonth={inMonth}
                isSelected={isSel}
                hasToday={isToday(day)}
                items={items}
                onClick={() => {
                  onSelect?.(day);
                  setOpenDate(day);            // <— mở modal
                }}
                onAdd={() => onAddMoment?.(day)}
              />
            );
          })
        )}
      </div>

      {openDate && (
        <DayMomentsModal
          date={openDate}
          items={openItems}
          onClose={() => setOpenDate(null)}
          onUpdateMoment={onUpdateMoment}
          onDeleteMoment={onDeleteMoment}
        />
      )}
    </div>
  );
}

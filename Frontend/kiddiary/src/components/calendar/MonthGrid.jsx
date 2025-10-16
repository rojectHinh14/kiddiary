import { format } from "date-fns";
import { isSameDay, isSameMonth, isToday } from "date-fns";
import DayCell from "./DayCell";

export default function MonthGrid({ current, matrix, grouped, selectedDate, onSelect, onAddMoment }) {
  const dayNames = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

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
                onClick={() => onSelect(day)}
                onAdd={() => onAddMoment(day)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
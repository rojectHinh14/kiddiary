import { format } from "date-fns";
export default function CalendarHeader({ current, onPrevYear, onNextYear, onSetMonth, onToday }) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const curMonthIdx = current.getMonth();

  return (
    <div className="flex items-center justify-between px-6 py-3">
      <div className="flex items-center gap-3">
        <button onClick={onPrevYear} className="text-red-500 text-sm">{`‹ Prev year`}</button>
        <div className="hidden md:flex items-center gap-2">
          {months.map((m, i) => (
            <button
              key={m}
              onClick={() => onSetMonth(i)}
              className={`px-3 py-1 rounded-full text-sm ${i===curMonthIdx ? "bg-yellow-300 font-medium ring-1 ring-black/10" : "hover:bg-black/5"}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="font-semibold">{format(current, "yyyy")}</div>

      <div className="flex items-center gap-3">
        <button onClick={onToday} className="flex items-center gap-1 text-sm hover:underline">
          <span>Today</span>
        </button>
        <button onClick={onNextYear} className="text-red-500 text-sm">{`Next year ›`}</button>
      </div>
    </div>
  );
}
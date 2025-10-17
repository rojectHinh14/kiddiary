import { format } from "date-fns";
import vi from "date-fns/locale/vi";


export default function DayCell({ date, inMonth, isSelected, hasToday, items, onClick, onAdd }) {
  const display = format(date, "d", { locale: vi });
  const thumb = items[0]?.images?.[0]; // 1 ảnh đại diện
  const more = Math.max(0, items.length - 1);

  return (
    <div
      onClick={onClick}
      className={[
        "relative aspect-square rounded-xl p-2 border transition",
        inMonth ? "bg-gray-50 border-transparent hover:border-black/10" : "bg-gray-100/70 border-transparent text-gray-400",
        isSelected ? "ring-2 ring-yellow-400" : "",
      ].join(" ")}
    >
      {/* góc trên - số ngày */}
      <div className="flex items-center justify-between">
        <div className={`text-sm ${hasToday ? "font-bold" : ""}`}>{display}</div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onAdd?.(); }}
          className="text-xs px-2 py-0.5 rounded-full border hover:bg-black/5"
          title="Add moment"
        >
          +
        </button>
      </div>

      {/* ảnh/stack */}
      {thumb && (
        <div className="mt-2">
          <img src={thumb} alt="" className="w-full h-20 object-cover rounded-md border-2 border-yellow-300" />
          {more > 0 && (
            <div className="absolute bottom-2 right-2 text-[11px] bg-white/90 rounded-full px-2 py-0.5 border">
              +{more}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
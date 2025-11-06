import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";

const mockDays = [
  {
    dateLabel: "Tuesday, August 15",
    sessions: [
      { type: "night", start: "22:00", end: "06:00", total: "8 hr 00 min", note: "Good Sleep" },
      { type: "day",   start: "14:00", end: "16:30", total: "2 hr 30 min", note: "Good Sleep" },
    ],
  },
];

function DayCard({ day }) {
  return (
    <div className="rounded-2xl border shadow-sm bg-white overflow-hidden">
      {/* header date */}
      <div className="px-4 py-2 bg-[#FAEED1] text-gray-700 text-sm font-semibold">
        {day.dateLabel}
      </div>

      {/* sessions */}
      <div className="p-3 space-y-3">
        {day.sessions.map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 rounded-xl bg-[#8FC9BF] text-[#0f4a45] px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {s.type === "night" ? "🌙" : "🌞"}
              </span>
              <div className="font-semibold text-white/95 tracking-wide">
                {s.start} - {s.end}
              </div>
            </div>

            <div className="hidden md:block text-white/90 text-sm">
              Total Sleep: {s.total}
            </div>

            <div className="text-white/90 text-sm italic">
              Note: {s.note}
            </div>

            <button className="shrink-0 rounded-full bg-white/40 hover:bg-white/60 px-2 py-1 text-sm">
              &gt;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SleepHistoryPage({ babyName = "Yen Nhi" }) {
  const navigate = useNavigate();
   const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredDays = useMemo(() => {
    if (!fromDate && !toDate) return mockDays;
    return mockDays.filter((d) => {
      const date = new Date(d.date);
      const from = fromDate ? new Date(fromDate) : new Date("2000-01-01");
      const to = toDate ? new Date(toDate) : new Date("3000-01-01");
      return date >= from && date <= to;
    });
  }, [fromDate, toDate]);

  // pagination demo
  const [page, setPage] = useState(2);
  const totalPages = 3;
  const days = useMemo(() => {
    // nhân mock data cho đủ list
    const arr = [];
    for (let i = 0; i < 4; i++) arr.push(...mockDays);
    return arr;
  }, []);

  return (
    <div className="py-4">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow hover:bg-white"
          >
            <ArrowBackIosNewRoundedIcon fontSize="small" />
          </button>
          <div className="text-xl font-bold text-gray-700">Sleep History for {babyName}</div>
        </div>

          <div className="flex items-center gap-2 text-gray-600 text-sm">
          <label>From:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded-lg px-2 py-1 outline-none focus:border-[#2CC1AE]"
          />
          <label>To:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded-lg px-2 py-1 outline-none focus:border-[#2CC1AE]"
          />
          <CalendarTodayRoundedIcon fontSize="small" className="text-gray-500" />
        </div>
      </div>

      {/* List */}
      <div className="space-y-5">
        {days.map((d, idx) => (
          <DayCard key={idx} day={d} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className={`px-4 py-2 rounded-xl border ${
            page === 1 ? "text-gray-400 border-gray-200" : "hover:bg-black/5"
          }`}
        >
          Previous
        </button>

        {[1, 2, 3].map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`w-8 h-8 rounded-md border text-sm ${
              p === page
                ? "bg-[#2CC1AE] text-white border-[#2CC1AE]"
                : "hover:bg-black/5"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className={`px-4 py-2 rounded-xl border ${
            page === totalPages ? "text-gray-400 border-gray-200" : "hover:bg-black/5"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

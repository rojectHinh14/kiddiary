// src/pages/health/sleep/SleepHistoryPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";

import { loadSleepHistory } from "../../store/slice/sleepSlice";

// ===== helpers =====
function span(start, end) {
  if (start == null || end == null) return 0;
  return end < start ? 1440 - start + end : end - start;
}

function classify(start, end) {
  if (start == null || end == null) return null;
  const winStart = 19 * 60;
  const winEnd = 7 * 60;
  let night = 0;

  const ov = (s, e) => {
    const a1 = Math.max(s, winStart);
    const b1 = Math.min(e, 1440);
    if (b1 > a1) night += b1 - a1;

    const a2 = Math.max(0, s - 1440);
    const b2 = Math.min(winEnd, e - 1440);
    if (b2 > a2) night += b2 - a2;
  };

  if (end >= start) {
    ov(start, end);
  } else {
    ov(start, 1440);
    ov(end, end + 1440);
  }

  const r = span(start, end) ? night / span(start, end) : 0;
  return end < start || r >= 0.5 ? "night" : "day";
}

function formatMinutes(totalMin) {
  const m = Math.round(totalMin || 0);
  const h = Math.floor(m / 60);
  const rest = m % 60;
  if (!h && !rest) return "0 min";
  if (!rest) return `${h} hr`;
  if (!h) return `${rest} min`;
  return `${h} hr ${rest} min`;
}

/* ---------- Card cho 1 ngày ---------- */
function DayCard({ day }) {
  return (
    <div className="rounded-2xl border shadow-sm bg-white overflow-hidden">
      {/* header date */}
      <div className="px-4 py-2 bg-[#FAEED1] text-gray-700 text-sm font-semibold">
        {day.dateLabel}
      </div>

      {/* sessions */}
      <div className="p-3 space-y-3">
        {day.sessions.map((s) => (
          <div
            key={s.id}
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
              Note: {s.note || "—"}
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

/* ---------- Trang history ---------- */
export default function SleepHistoryPage({ babyName = "Yến Nhi" }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { childId } = useParams(); // /home/health/sleep/:childId/history

  const { logs = [], loading, error } = useSelector(
    (state) => state.childSleep || {}
  );

  console.log("log : " , logs);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // gọi API mỗi khi childId / from / to đổi
  useEffect(() => {
    if (!childId) return;

    dispatch(
      loadSleepHistory({
        childId,
        from: fromDate || undefined,
        to: toDate || undefined,
      })
    );
  }, [childId, fromDate, toDate, dispatch]);

  // group log theo ngày cho UI
  const days = useMemo(() => {
    const list = logs || [];
    const map = new Map();

    list.forEach((log) => {
      const dateObj = new Date(log.sleepDate || log.startTime);

      const dateLabel = dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const start = new Date(log.startTime);
      const end = log.endTime ? new Date(log.endTime) : null;

      const startStr = start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const endStr = end
        ? end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "--";

      const sMin = start.getHours() * 60 + start.getMinutes();
      const eMin = end ? end.getHours() * 60 + end.getMinutes() : null;

      const duration = log.duration ?? span(sMin, eMin);
      const type = classify(sMin, eMin) || "night";

      const sessions = map.get(dateLabel) || [];
      sessions.push({
        id: log.id,
        type,
        start: startStr,
        end: endStr,
        total: formatMinutes(duration),
        note: log.notes,
        raw: log,
      });
      map.set(dateLabel, sessions);
    });

    return Array.from(map.entries()).map(([dateLabel, sessions]) => ({
      dateLabel,
      sessions,
    }));
  }, [logs]);

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
          <div className="text-xl font-bold text-gray-700">
            Sleep History for {babyName}
          </div>
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
          <CalendarTodayRoundedIcon
            fontSize="small"
            className="text-gray-500"
          />
        </div>
      </div>

      {/* Loading / error */}
      {loading && (
        <p className="text-sm text-gray-500 mb-2">Đang tải dữ liệu...</p>
      )}
      {error && (
        <p className="text-sm text-red-500 mb-2">
          {error === "Network Error"
            ? "Không kết nối được server"
            : String(error)}
        </p>
      )}

      <div className="space-y-5">
        {(!days || days.length === 0) && !loading && !error && (
          <p className="text-sm text-gray-500">
            Không có bản ghi ngủ trong khoảng ngày đã chọn.
          </p>
        )}

        {days.map((d, idx) => (
          <DayCard key={idx} day={d} />
        ))}
      </div>
    </div>
  );
}

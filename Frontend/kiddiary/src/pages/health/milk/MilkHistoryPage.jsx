// src/pages/health/milk/MilkHistoryPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

import {
  loadChildMilkLogs,
  updateMilkLog,
  deleteMilkLog,
} from "../../../store/slice/childMilkSlice";

export default function MilkHistoryPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { childId } = useParams(); // /home/health/milk/:childId/history

  const todayStr = new Date().toISOString().slice(0, 10);

  const [page, setPage] = useState(1);
  const [from, setFrom] = useState(todayStr);
  const [to, setTo] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ time: "", amount: "", note: "" });

  const { logs, loading, error } = useSelector((state) => state.childMilk);

  // tải lịch sử theo ngày "from" (tạm thời dùng 1 ngày; backend chỉ hỗ trợ date single)
  useEffect(() => {
    if (!childId || !from) return;
    dispatch(loadChildMilkLogs({ childId, date: from }));
  }, [childId, from, dispatch]);

  // group logs theo ngày để hiển thị giống rows mock
  const rows = useMemo(() => {
    if (!logs || logs.length === 0) return [];

    const map = new Map();
    logs.forEach((log) => {
      const d = new Date(log.feedingAt);
      const dateLabel = d.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const timeStr = d.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const items = map.get(dateLabel) || [];
      items.push({
        id: log.id,
        time: timeStr,
        amount: log.amountMl,
        type: log.sourceCode, // BREAST / BOTTLE
        note: log.note || "",
        raw: log,
      });
      map.set(dateLabel, items);
    });

    return Array.from(map.entries()).map(([date, items]) => ({
      date,
      items,
    }));
  }, [logs]);

  // ===== handlers =====
  const handleEdit = (item) => {
    setSelected(item);
    // time cho input type="time" phải dạng HH:mm 24h
    const rawDate = new Date(item.raw.feedingAt);
    const hh = String(rawDate.getHours()).padStart(2, "0");
    const mm = String(rawDate.getMinutes()).padStart(2, "0");

    setForm({
      time: `${hh}:${mm}`,
      amount: String(item.amount),
      note: item.note || "",
    });
    setEditOpen(true);
  };

  const handleDelete = (item) => {
    setSelected(item);
    setDeleteOpen(true);
  };

  const handleSave = async () => {
    if (!selected || !childId) return;

    const amountMl = Number(form.amount);
    if (Number.isNaN(amountMl) || amountMl <= 0) {
      alert("Amount must be > 0");
      return;
    }

    try {
      const old = selected.raw;
      const oldDate = new Date(old.feedingAt);
      const [hStr, mStr] = form.time.split(":");
      const h = parseInt(hStr, 10) || 0;
      const m = parseInt(mStr, 10) || 0;

      const newDate = new Date(oldDate);
      newDate.setHours(h, m, 0, 0);

      await dispatch(
        updateMilkLog({
          childId,
          milkLogId: old.id,
          payload: {
            feedingAt: newDate.toISOString(),
            amountMl,
            note: form.note,
          },
        })
      ).unwrap();

      setEditOpen(false);
    } catch (err) {
      console.error(err);
      alert(err?.message || "Update feeding record failed");
    }
  };

  const confirmDelete = async () => {
    if (!selected || !childId) return;

    try {
      await dispatch(
        deleteMilkLog({
          childId,
          milkLogId: selected.raw.id,
        })
      ).unwrap();
      setDeleteOpen(false);
    } catch (err) {
      console.error(err);
      alert(err?.message || "Delete feeding record failed");
    }
  };

  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <IconButton
          onClick={() => navigate(`/home/health/milk/${childId}`)}
          sx={{
            width: 40,
            height: 40,
            borderRadius: "999px",
            background: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,.08)",
          }}
        >
          <ArrowBackIosNewRoundedIcon fontSize="small" />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#374151" }}>
          Feeding History
        </Typography>
      </div>

      {/* Date range filter (tạm dùng 'from' làm ngày đang xem) */}
      <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
        <span>from:</span>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border rounded-lg px-2 py-1 outline-none focus:border-[#2CC1AE]"
        />
        <span>to:</span>
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border rounded-lg px-2 py-1 outline-none focus:border-[#2CC1AE]"
        />
        <CalendarTodayRoundedIcon
          fontSize="small"
          className="text-gray-500"
        />
      </div>

      {/* Loading / error */}
      {loading && (
        <Typography sx={{ mb: 2, color: "#6B7280" }}>
          Đang tải dữ liệu...
        </Typography>
      )}
      {error && (
        <Typography sx={{ mb: 2, color: "red" }}>
          {error === "Network Error" ? "Không kết nối được server" : error}
        </Typography>
      )}

      {/* List theo ngày */}
      {rows.length === 0 && !loading && !error && (
        <Typography sx={{ color: "#6B7280", mb: 2 }}>
          Không có bản ghi bú cho ngày này.
        </Typography>
      )}

      {rows.map((day, i) => (
        <div
          key={i}
          className="mb-4 rounded-2xl bg-[#FFF1D5] p-3 shadow-sm"
        >
          <div className="text-sm font-semibold text-gray-700 mb-2">
            {day.date}
          </div>
          {day.items.map((it) => (
            <div
              key={it.id}
              className="mt-2 flex flex-wrap gap-2 items-center justify-between rounded-full bg-[#CFE6FF] px-3 py-2"
            >
              <div className="font-semibold min-w-[60px]">{it.time}</div>
              <div className="opacity-70 min-w-[60px]">{it.type}</div>
              <div className="opacity-70 italic flex-1">
                Note: {it.note || "—"}
              </div>
              <div className="font-semibold min-w-[80px] text-right">
                {it.amount} ml
              </div>
              <div className="flex gap-2">
                <Button
                  size="small"
                  onClick={() => handleEdit(it)}
                  sx={{
                    bgcolor: "#9EDBD1",
                    color: "#065F46",
                    fontWeight: 600,
                    borderRadius: "999px",
                    px: 2,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#BFEDE1" },
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  onClick={() => handleDelete(it)}
                  sx={{
                    bgcolor: "#FF6B6B",
                    color: "white",
                    fontWeight: 600,
                    borderRadius: "999px",
                    px: 2,
                    textTransform: "none",
                    "&:hover": { bgcolor: "#FF5252" },
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Edit dialog */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#065F46" }}>
          Edit Feeding Record
        </DialogTitle>
        <DialogContent dividers sx={{ background: "#F8FAFC" }}>
          <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
            <TextField
              label="Time"
              type="time"
              value={form.time}
              onChange={(e) =>
                setForm({ ...form, time: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Amount (ml)"
              type="number"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
            />
            <TextField
              label="Note"
              value={form.note}
              onChange={(e) =>
                setForm({ ...form, note: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setEditOpen(false)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              bgcolor: "#2CC1AE",
              textTransform: "none",
              fontWeight: 700,
              "&:hover": { bgcolor: "#1CA797" },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete dialog */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#DC2626" }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent dividers sx={{ background: "#FEF2F2" }}>
          <Typography sx={{ color: "#374151" }}>
            Are you sure you want to delete the feeding record at{" "}
            <b>{selected?.time}</b> with <b>{selected?.amount} ml</b>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setDeleteOpen(false)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmDelete}
            sx={{
              bgcolor: "#EF4444",
              color: "#fff",
              textTransform: "none",
              fontWeight: 700,
              "&:hover": { bgcolor: "#DC2626" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pagination UI (tạm thời client-side, chưa nối backend) */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className={`px-4 py-2 rounded-xl border ${
            page === 1
              ? "text-gray-400 border-gray-200"
              : "hover:bg-black/5"
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
          disabled={page === 3}
          onClick={() => setPage((p) => Math.min(3, p + 1))}
          className={`px-4 py-2 rounded-xl border ${
            page === 3
              ? "text-gray-400 border-gray-200"
              : "hover:bg-black/5"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

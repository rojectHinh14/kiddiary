import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import MonitorWeightRoundedIcon from "@mui/icons-material/MonitorWeightRounded";
import HeightRoundedIcon from "@mui/icons-material/HeightRounded";
import ChildCareRoundedIcon from "@mui/icons-material/ChildCareRounded";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteOneHistory,
  loadChildHistory,
  updateOneHistory,
} from "../../../store/slice/childHistoorySlice";

const PAGE_SIZE = 5; // số bản ghi mỗi trang

export default function GrowthPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { childId } = useParams(); // /home/health/growth/:childId

  const [page, setPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { list: historyRaw, loading, error } = useSelector(
    (state) => state.childHistory
  );

  // local UI state cho dialog
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ date: "", height: "", weight: "" });

  // load history khi vào trang / đổi childId
  useEffect(() => {
    if (childId) {
      dispatch(loadChildHistory(childId));
    }
  }, [childId, dispatch]);

  // map thêm BMI cho list
  const historyData = (historyRaw || []).map((item) => {
    const h = item.height;
    const w = item.weight;
    const bmi = h > 0 ? +(w / Math.pow(h / 100, 2)).toFixed(1) : null;
    return { ...item, bmi };
  });

  // ====== Filter theo khoảng ngày ======
  const filteredData = historyData.filter((item) => {
    const d = new Date(item.date);
    if (fromDate && d < new Date(fromDate)) return false;
    if (toDate && d > new Date(toDate)) return false;
    return true;
  });

  // reset page về 1 mỗi khi đổi filter
  useEffect(() => {
    setPage(1);
  }, [fromDate, toDate]);

  // ====== Pagination ======
  const pageCount = Math.max(
    1,
    Math.ceil((filteredData.length || 1) / PAGE_SIZE)
  );
  const safePage = Math.min(page, pageCount);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const pagedData = filteredData.slice(startIndex, endIndex);

  // ====== latest measurement (bản mới nhất trong toàn bộ history, không phụ thuộc filter) ======
  const latest = historyData[0] || null;

  const latestDateLabel = latest
    ? new Date(latest.date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "No data";

  const latestWeight = latest?.weight ?? "-";
  const latestHeight = latest?.height ?? "-";
  const latestBmi = latest?.bmi ?? "-";

  // ====== Handlers ======
  const handleEdit = (item) => {
    setSelected(item);
    setForm({
      date: item.date ? item.date.slice(0, 10) : "",
      height: String(item.height ?? ""),
      weight: String(item.weight ?? ""),
    });
    setEditOpen(true);
  };

  const handleDelete = (item) => {
    setSelected(item);
    setDeleteOpen(true);
  };

  const handleSave = async () => {
    if (!selected || !childId) return;

    const h = parseFloat(form.height);
    const w = parseFloat(form.weight);

    try {
      await dispatch(
        updateOneHistory({
          childId,
          id: selected.id,
          payload: {
            date: form.date,
            height: h,
            weight: w,
          },
        })
      ).unwrap();

      setEditOpen(false);
    } catch (err) {
      console.error(err);
      alert("Cập nhật đo lường thất bại");
    }
  };

  const confirmDelete = async () => {
    if (!selected || !childId) return;

    try {
      await dispatch(
        deleteOneHistory({ childId, id: selected.id })
      ).unwrap();
      setDeleteOpen(false);
    } catch (err) {
      console.error(err);
      alert("Xóa đo lường thất bại");
    }
  };

  // ====== RENDER ======
  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <IconButton
            onClick={() => navigate("/home/health")}
            sx={{
              width: 40,
              height: 40,
              borderRadius: "999px",
              background: "#FFF",
              boxShadow: "0 2px 6px rgba(0,0,0,.08)",
              "&:hover": { background: "#FFF" },
            }}
          >
            <ArrowBackIosNewRoundedIcon fontSize="small" />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#374151" }}>
            Growth Overview for
          </Typography>
         
        </div>

        <Button
          sx={{
            bgcolor: "#FFF3DC",
            color: "#5B4B22",
            fontWeight: 600,
            borderRadius: "12px",
            textTransform: "none",
            px: 2,
            py: 1,
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            "&:hover": { bgcolor: "#FFEECF" },
          }}
          onClick={() => navigate(`/home/health/growth/${childId}/new`)}
          startIcon={<MonitorWeightRoundedIcon />}
        >
          Add Measurement
        </Button>
      </div>

      {/* Latest measurement card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          background: "#FFF8EE",
          p: 3,
          mb: 4,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          position: "relative",
        }}
      >
        <Box sx={{ position: "absolute", top: 12, right: 12 }}>
          <Chip
            size="small"
            label={latest ? latestDateLabel : "Chưa có dữ liệu"}
            sx={{
              bgcolor: "#fff",
              color: "#6B7280",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,.06)",
              "& .MuiChip-label": { px: 1.2, py: 0.2, fontWeight: 600 },
            }}
          />
        </Box>

        <Typography sx={{ fontWeight: 700, color: "#374151", mb: 1 }}>
          Latest Measurement
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            textAlign: "center",
          }}
        >
          <Box>
            <MonitorWeightRoundedIcon
              sx={{ color: "#16837B", fontSize: 30 }}
            />
            <Typography
              sx={{ fontSize: 36, fontWeight: 800, color: "#16837B" }}
            >
              {latestWeight}
            </Typography>
            <Typography sx={{ color: "gray" }}>kg</Typography>
          </Box>
          <Box>
            <HeightRoundedIcon sx={{ color: "#16837B", fontSize: 30 }} />
            <Typography
              sx={{ fontSize: 36, fontWeight: 800, color: "#16837B" }}
            >
              {latestHeight}
            </Typography>
            <Typography sx={{ color: "gray" }}>cm</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 14, color: "gray" }}>BMI</Typography>
            <Typography
              sx={{ fontSize: 36, fontWeight: 800, color: "#16837B" }}
            >
              {latestBmi}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Chip
            clickable
            icon={<PublicRoundedIcon sx={{ fontSize: 16 }} />}
            label="WHO standard"
            onClick={() => navigate("/home/health/growth/who-standard")}
            size="small"
            sx={{
              bgcolor: "#D8F6EF",
              color: "#066C61",
              borderRadius: "999px",
              boxShadow: "0 1px 3px rgba(0,0,0,.06)",
              "& .MuiChip-label": { px: 1.2, py: 0.1, fontWeight: 700 },
              "&:hover": { bgcolor: "#BFEDE1" },
            }}
          />
        </Box>
      </Card>

      {/* Growth History header + filter */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography sx={{ fontWeight: 700, color: "#374151" }}>
          Growth History
        </Typography>

        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <span>from:</span>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded-lg px-2 py-1 outline-none focus:border-[#2CC1AE]"
          />
          <span>to:</span>
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
      </Box>

      {/* Loading / error */}
      {loading && (
        <Typography sx={{ mb: 2, color: "#6B7280" }}>
          Đang tải dữ liệu...
        </Typography>
      )}
      {error && (
        <Typography sx={{ mb: 2, color: "red" }}>
          {error === "Network Error"
            ? "Không kết nối được server"
            : error}
        </Typography>
      )}

      {/* History list */}
      <div className="space-y-3">
        {pagedData.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap justify-between items-center bg-[#8FC9BF] text-white/90 rounded-xl px-4 py-2 shadow-sm"
          >
            <div className="font-medium text-white">
              <span className="font-semibold">Date:</span>{" "}
              {new Date(item.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>

            <div className="text-sm text-white/90">
              Height:{" "}
              <span className="font-semibold">{item.height} cm</span> | Weight:{" "}
              <span className="font-semibold">{item.weight} kg</span> | BMI:{" "}
              <span className="font-semibold">{item.bmi ?? "-"}</span>
            </div>

            <div className="flex gap-2">
              <Button
                size="small"
                onClick={() => handleEdit(item)}
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
                onClick={() => handleDelete(item)}
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

        {!loading && filteredData.length === 0 && !error && (
          <Typography sx={{ color: "#6B7280" }}>
            Không có bản ghi trong khoảng thời gian này.
          </Typography>
        )}
      </div>

      {/* Edit dialog */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Measurement</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
            <TextField
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Height (cm)"
              type="number"
              value={form.height}
              onChange={(e) =>
                setForm({ ...form, height: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Weight (kg)"
              type="number"
              value={form.weight}
              onChange={(e) =>
                setForm({ ...form, weight: e.target.value })
              }
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
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
        <DialogTitle>Delete Measurement</DialogTitle>
        <DialogContent dividers>
          Bạn có chắc chắn muốn xóa bản ghi ngày{" "}
          <b>
            {selected
              ? new Date(selected.date).toLocaleDateString()
              : ""}
          </b>
          ?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          disabled={safePage === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className={`px-4 py-2 rounded-xl border ${
            safePage === 1
              ? "text-gray-400 border-gray-200"
              : "hover:bg-black/5"
          }`}
        >
          Previous
        </button>

        {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            className={`w-8 h-8 rounded-md border text-sm ${
              p === safePage
                ? "bg-[#2CC1AE] text-white border-[#2CC1AE]"
                : "hover:bg-black/5"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          disabled={safePage === pageCount}
          onClick={() =>
            setPage((p) => Math.min(pageCount, p + 1))
          }
          className={`px-4 py-2 rounded-xl border ${
            safePage === pageCount
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

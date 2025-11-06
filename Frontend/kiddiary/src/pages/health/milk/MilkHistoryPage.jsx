import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function MilkHistoryPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(2);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
   const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ time: "", amount: "", note: "" });

    const handleEdit = (item) => {
    setSelected(item);
    setForm({ time: item.time, amount: item.amount, note: item.note });
    setEditOpen(true);
  };

  const handleDelete = (item) => {
    setSelected(item);
    setDeleteOpen(true);
  };

  const handleSave = () => {
    // TODO: API call or update logic here
    console.log("Saving:", form);
    setEditOpen(false);
  };

  const confirmDelete = () => {
    // TODO: API call or delete logic here
    console.log("Deleting:", selected);
    setDeleteOpen(false);
  };


  const rows = [
    { date: "Tuesday, August 15", items: [
      { time: "15:30", amount: 120, type: "Bottle", note: "Good intake" },
      { time: "09:00", amount: 120, type: "Bottle", note: "Good intake" },
      { time: "03:00", amount: 120, type: "Bottle", note: "Good intake" },
      { time: "00:00", amount: 120, type: "Bottle", note: "Good intake" },
    ]},
    { date: "Tuesday, August 15", items: [
      { time: "15:30", amount: 120, type: "Bottle", note: "Good intake" },
      { time: "09:00", amount: 120, type: "Bottle", note: "Good intake" },
      { time: "03:00", amount: 120, type: "Bottle", note: "Good intake" },
      { time: "00:00", amount: 120, type: "Bottle", note: "Good intake" },
    ]},
  ];

  return (
    <div className="py-4">
      <div className="flex items-center gap-3 mb-4">
        <IconButton
          onClick={() => navigate("/home/health/milk")}
          sx={{ width: 40, height: 40, borderRadius: "999px", background: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,.08)" }}
        >
          <ArrowBackIosNewRoundedIcon fontSize="small" />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#374151" }}>
          Feeding History
        </Typography>
      </div>

      {/* Date range filter */}
      <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
        <span>from:</span>
        <input type="date" value={from} onChange={e=>setFrom(e.target.value)}
               className="border rounded-lg px-2 py-1 outline-none focus:border-[#2CC1AE]" />
        <span>to:</span>
        <input type="date" value={to} onChange={e=>setTo(e.target.value)}
               className="border rounded-lg px-2 py-1 outline-none focus:border-[#2CC1AE]" />
        <CalendarTodayRoundedIcon fontSize="small" className="text-gray-500" />
      </div>

      {rows.map((day, i) => (
        <div key={i} className="mb-4 rounded-2xl bg-[#FFF1D5] p-3 shadow-sm">
          <div className="text-sm font-semibold text-gray-700 mb-2">{day.date}</div>
          {day.items.map((it, j) => (
            <div key={j}
              className="mt-2 flex items-center justify-between rounded-full bg-[#CFE6FF] px-3 py-2">
              <div className="font-semibold">{it.time}</div>
              <div className="opacity-70">{it.type}</div>
              <div className="opacity-70 italic">Note: {it.note}</div>
              <div className="font-semibold">{it.amount} ml</div>
              <div className="flex gap-2">
               <div className="flex gap-2">
  <Button
    size="small"
    onClick={() => handleEdit(it)}
    sx={{
      bgcolor: "#9EDBD1", color: "#065F46", fontWeight: 600,
      borderRadius: "999px", px: 2, textTransform: "none",
      "&:hover": { bgcolor: "#BFEDE1" },
    }}
  >
    Edit
  </Button>
  <Button
    size="small"
    onClick={() => handleDelete(it)}
    sx={{
      bgcolor: "#FF6B6B", color: "white", fontWeight: 600,
      borderRadius: "999px", px: 2, textTransform: "none",
      "&:hover": { bgcolor: "#FF5252" },
    }}
  >
    Delete
  </Button>
</div>
              </div>
            </div>
          ))}
        </div>
      ))}

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
  <DialogTitle sx={{ fontWeight: 700, color: "#065F46" }}>Edit Feeding Record</DialogTitle>
  <DialogContent dividers sx={{ background: "#F8FAFC" }}>
    <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
      <TextField
        label="Time"
        type="time"
        value={form.time}
        onChange={(e) => setForm({ ...form, time: e.target.value })}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Amount (ml)"
        type="number"
        value={form.amount}
        onChange={(e) => setForm({ ...form, amount: e.target.value })}
      />
      <TextField
        label="Note"
        value={form.note}
        onChange={(e) => setForm({ ...form, note: e.target.value })}
      />
    </Box>
  </DialogContent>
  <DialogActions sx={{ p: 2 }}>
    <Button onClick={() => setEditOpen(false)} sx={{ textTransform: "none" }}>Cancel</Button>
    <Button
      variant="contained"
      onClick={handleSave}
      sx={{
        bgcolor: "#2CC1AE", textTransform: "none", fontWeight: 700,
        "&:hover": { bgcolor: "#1CA797" },
      }}
    >
      Save Changes
    </Button>
  </DialogActions>
</Dialog>
<Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} fullWidth maxWidth="xs">
  <DialogTitle sx={{ fontWeight: 700, color: "#DC2626" }}>Confirm Deletion</DialogTitle>
  <DialogContent dividers sx={{ background: "#FEF2F2" }}>
    <Typography sx={{ color: "#374151" }}>
      Are you sure you want to delete the feeding record at{" "}
      <b>{selected?.time}</b> with <b>{selected?.amount} ml</b>?
    </Typography>
  </DialogContent>
  <DialogActions sx={{ p: 2 }}>
    <Button onClick={() => setDeleteOpen(false)} sx={{ textTransform: "none" }}>
      Cancel
    </Button>
    <Button
      variant="contained"
      onClick={confirmDelete}
      sx={{
        bgcolor: "#EF4444", color: "#fff", textTransform: "none", fontWeight: 700,
        "&:hover": { bgcolor: "#DC2626" },
      }}
    >
      Delete
    </Button>
  </DialogActions>
</Dialog>


      {/* pagination */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          disabled={page===1}
          onClick={()=>setPage(p=>Math.max(1,p-1))}
          className={`px-4 py-2 rounded-xl border ${page===1? "text-gray-400 border-gray-200" : "hover:bg-black/5"}`}
        >Previous</button>
        {[1,2,3].map(p=>(
          <button key={p} onClick={()=>setPage(p)}
            className={`w-8 h-8 rounded-md border text-sm ${p===page? "bg-[#2CC1AE] text-white border-[#2CC1AE]":"hover:bg-black/5"}`}>
            {p}
          </button>
        ))}
        <button
          disabled={page===3}
          onClick={()=>setPage(p=>Math.min(3,p+1))}
          className={`px-4 py-2 rounded-xl border ${page===3? "text-gray-400 border-gray-200" : "hover:bg-black/5"}`}
        >Next</button>
      </div>
    </div>
  );
}

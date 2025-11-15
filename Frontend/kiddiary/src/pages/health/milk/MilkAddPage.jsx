// src/pages/health/milk/MilkAddPage.jsx
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

import { createMilkLog } from "../../../store/slice/childMilkSlice";

export default function MilkAddPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { childId } = useParams(); // /home/health/milk/:childId/new

  // default: hôm nay
  const todayStr = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState("09:00"); // HH:mm (24h, do <input type="time">)
  const [ampm, setAmpm] = useState("am");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Breast"); // Breast | Bottle
  const [tags, setTags] = useState([]);
  const [saving, setSaving] = useState(false);

  const toggleTag = (t) =>
    setTags((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  // convert time + am/pm -> HH:mm (24h)
  const buildFeedingAt = () => {
    if (!date || !time) return null;
    const [hStr, mStr] = time.split(":");
    let h = parseInt(hStr, 10);
    if (ampm === "pm" && h < 12) h += 12;
    if (ampm === "am" && h === 12) h = 0;
    const hh = String(h).padStart(2, "0");
    return `${date}T${hh}:${mStr}:00`;
  };

  const save = async () => {
    if (!childId) {
      alert("Missing childId in URL");
      return;
    }
    if (!date || !time || !amount) {
      alert("Please fill date, time and amount.");
      return;
    }

    const feedingAt = buildFeedingAt();
    if (!feedingAt) {
      alert("Invalid date/time");
      return;
    }

    const amountMl = Number(amount);
    if (Number.isNaN(amountMl) || amountMl <= 0) {
      alert("Amount must be > 0");
      return;
    }

    const sourceCode = type === "Breast" ? "BREAST" : "BOTTLE";

    try {
      setSaving(true);
      await dispatch(
        createMilkLog({
          childId,
          payload: {
            feedingAt,
            amountMl,
            sourceCode,
            moodTags: tags,
            note: null,
          },
        })
      ).unwrap();

      // quay lại overview của bé
      navigate(`/home/health/milk/${childId}`);
    } catch (err) {
      console.error(err);
      alert(err?.message || "Failed to save feeding record");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-4">
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
          Add New Feeding
        </Typography>
      </div>

      <Box
        sx={{
          p: 3,
          bgcolor: "#9EC6C3",
          borderRadius: 3,
          boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
        }}
      >
        <div className="grid gap-4">
          <TextField
            type="date"
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ bgcolor: "#fff", borderRadius: 2 }}
          />

          <div className="flex gap-3">
            <TextField
              type="time"
              label="Time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ bgcolor: "#fff", borderRadius: 2 }}
            />
            <TextField
              select
              SelectProps={{ native: true }}
              label="AM/PM"
              value={ampm}
              onChange={(e) => setAmpm(e.target.value)}
              sx={{ bgcolor: "#fff", borderRadius: 2, width: 100 }}
            >
              <option value="am">am</option>
              <option value="pm">pm</option>
            </TextField>
          </div>

          <div className="flex items-center gap-2">
            <TextField
              type="number"
              label="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              sx={{ bgcolor: "#fff", borderRadius: 2 }}
            />
            <Chip label="ml" sx={{ bgcolor: "#fff" }} />
          </div>

          <div className="flex gap-2">
            {["Breast", "Bottle"].map((t) => (
              <Button
                key={t}
                onClick={() => setType(t)}
                size="small"
                variant="contained"
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: "999px",
                  bgcolor: type === t ? "#FACC15" : "#fff",
                  color: "#111",
                }}
              >
                {t}
              </Button>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap">
            {["Good intake", "Fussy", "Startled"].map((t) => (
              <Button
                key={t}
                onClick={() => toggleTag(t)}
                size="small"
                variant="contained"
                sx={{
                  textTransform: "none",
                  borderRadius: "999px",
                  bgcolor: tags.includes(t) ? "#2CC1AE" : "#F3F4F6",
                  color: tags.includes(t) ? "white" : "#374151",
                }}
              >
                {t}
              </Button>
            ))}
          </div>

          <div className="flex gap-2 mt-2">
            <Button
              onClick={save}
              disabled={saving}
              variant="contained"
              sx={{
                bgcolor: "#22C55E",
                textTransform: "none",
                fontWeight: 800,
                px: 3,
                "&:hover": { bgcolor: "#16A34A" },
              }}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={() => navigate(-1)}
              variant="contained"
              sx={{
                bgcolor: "#111827",
                color: "#fff",
                textTransform: "none",
                fontWeight: 700,
                px: 3,
                "&:hover": { bgcolor: "#0B1220" },
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Box>
    </div>
  );
}

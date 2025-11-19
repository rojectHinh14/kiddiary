import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import BabyChangingStationRoundedIcon from "@mui/icons-material/BabyChangingStationRounded";
import WbTwilightRoundedIcon from "@mui/icons-material/WbTwilightRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";

import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSleepLog } from "../../store/slice/sleepSlice";

/** Utility */
function toMinutes(hhmm) {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
function minutesSpan(start, end) {
  if (start == null || end == null) return 0;
  if (end < start) return 24 * 60 - start + end; // qua nửa đêm
  return end - start;
}

/** Phân loại night/day cho UI */
function classifySleep(startMin, endMin) {
  if (startMin == null || endMin == null) return null;
  const span = minutesSpan(startMin, endMin);
  const windowNightStart = 19 * 60; // 19:00
  const windowNightEnd = 7 * 60; // 07:00 (qua ngày)
  let minutesNight = 0;

  const addNightOverlap = (s, e) => {
    // overlap với [19:00..24:00)
    const a1 = Math.max(s, windowNightStart);
    const b1 = Math.min(e, 24 * 60);
    if (b1 > a1) minutesNight += b1 - a1;
    // overlap với [0:00..7:00)
    const a2 = Math.max(0, s - 24 * 60);
    const b2 = Math.min(windowNightEnd, e - 24 * 60);
    if (b2 > a2) minutesNight += b2 - a2;
  };

  if (endMin >= startMin) {
    addNightOverlap(startMin, endMin);
  } else {
    addNightOverlap(startMin, 24 * 60);
    addNightOverlap(endMin, endMin + 24 * 60);
  }

  const ratioNight = span ? minutesNight / span : 0;
  if (endMin < startMin || ratioNight >= 0.5) return "night";
  return "day";
}

export default function SleepAddPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { childId } = useParams(); // /home/health/sleep/:childId/new

  const { list: children } = useSelector((s) => s.children || {});
  const child = children?.find((c) => String(c.id) === String(childId));
  const babyName = child
    ? `${child.firstName.trim()} ${child.lastName}`
    : "Baby";

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [start, setStart] = useState("21:00");
  const [end, setEnd] = useState("05:00");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState([]);

  const startMin = useMemo(() => toMinutes(start), [start]);
  const endMin = useMemo(() => toMinutes(end), [end]);
  const type = useMemo(
    () => classifySleep(startMin, endMin),
    [startMin, endMin]
  );

  const { loading, error } = useSelector((s) => s.childSleep || {});

  const ampm = (hhmm) => {
    if (!hhmm) return "";
    const h = Number(hhmm.split(":")[0]);
    return h < 12 ? "am" : "pm";
  };

  const toggleTag = (t) =>
    setTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  const qualitySuggestions = ["Good sleep", "Fussy", "Startled"];

  // map tag → ENUM trong DB
  const mapQuality = () => {
    if (tags.includes("Fussy")) return "FUSSY";
    if (tags.includes("Startled")) return "STARTLED";
    return "GOOD"; // default
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSave = async () => {
    if (!childId) {
      alert("Missing childId in URL");
      return;
    }
    if (!date || !start || !end) {
      alert("Please fill date, start time and end time");
      return;
    }

    // build startTime / endTime ISO
    const startDate = new Date(`${date}T${start}:00`);
    let endDate = new Date(`${date}T${end}:00`);
    // nếu qua nửa đêm, cộng thêm 1 ngày
    if (endDate <= startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }

    const payload = {
      sleepDate: date,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      quality: mapQuality(), // "GOOD" | "FUSSY" | "STARTLED"
      notes,
      // duration backend tự tính, nên có cũng được, không có cũng không sao
      // duration: minutesSpan(startMin, endMin),
    };

    try {
      await dispatch(
        createSleepLog({
          childId,
          payload,
        })
      ).unwrap();

      navigate(`/home/health/sleep/${childId}`);
    } catch (err) {
      console.error(err);
      alert(err?.message || "Create sleep log failed");
    }
  };

  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <IconButton
          onClick={handleBack}
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
          Add New Sleep for
        </Typography>

        <Chip
          label={
            <div className="flex items-center gap-2">
              <span className="font-semibold">{babyName}</span>
              <BabyChangingStationRoundedIcon className="text-rose-400" />
            </div>
          }
          sx={{
            bgcolor: "#98CFC8",
            color: "#064E3B",
            borderRadius: "18px",
            height: 40,
            px: 1.5,
            fontWeight: 700,
          }}
        />
      </div>

      {/* Error message nếu có */}
      {error && (
        <Typography sx={{ mb: 2, color: "red" }}>
          {typeof error === "string" ? error : "Request failed"}
        </Typography>
      )}

      {/* Form block */}
      <Box
        sx={{
          borderRadius: 3,
          bgcolor: "#9EC6C3",
          boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "center",
            gap: 2,
            px: 2.5,
            py: 2,
          }}
        >
          {/* Date */}
          <Box>
            <Typography sx={{ color: "#1F2937", fontWeight: 700, mb: 1 }}>
              Date
            </Typography>
            <TextField
              size="medium"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                "& .MuiOutlinedInput-input": { py: 1.2 },
                width: 360,
                maxWidth: "100%",
              }}
            />
          </Box>

          {/* Auto classification + badge */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              justifySelf: "end",
              pr: 1,
            }}
          >
            <Chip
              icon={
                type === "night" ? (
                  <WbTwilightRoundedIcon />
                ) : (
                  <WbSunnyRoundedIcon />
                )
              }
              label={type === "night" ? "Night sleep" : "Day sleep"}
              sx={{
                bgcolor: type === "night" ? "#F4D1C7" : "#FCE4B5",
                color: "#4B5563",
                fontWeight: 700,
                px: 1.5,
                height: 36,
                borderRadius: "999px",
              }}
            />
          </Box>
        </Box>

        {/* Times */}
        <Box sx={{ px: 2.5, pb: 1 }}>
          <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", mb: 2 }}>
            <Box>
              <Typography sx={{ color: "#1F2937", fontWeight: 700, mb: 1 }}>
                Start time
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <TextField
                  type="time"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-input": { py: 1.1 },
                  }}
                />
                <Chip
                  label={ampm(start)}
                  sx={{
                    bgcolor: "#FFF",
                    fontWeight: 700,
                    borderRadius: "999px",
                    height: 36,
                  }}
                />
              </Box>
            </Box>

            <Box>
              <Typography sx={{ color: "#1F2937", fontWeight: 700, mb: 1 }}>
                End time
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <TextField
                  type="time"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  sx={{
                    bgcolor: "white",
                    borderRadius: 2,
                    "& .MuiOutlinedInput-input": { py: 1.1 },
                  }}
                />
                <Chip
                  label={ampm(end)}
                  sx={{
                    bgcolor: "#FFF",
                    fontWeight: 700,
                    borderRadius: "999px",
                    height: 36,
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Notes */}
          <Box sx={{ mb: 1.5 }}>
            <Typography sx={{ color: "#1F2937", fontWeight: 700, mb: 1 }}>
              Sleep Quality Notes (Optional)
            </Typography>
            <TextField
              multiline
              minRows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                width: "100%",
              }}
            />
          </Box>

          {/* Suggestions */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
              mb: 2,
            }}
          >
            {qualitySuggestions.map((q) => (
              <Button
                key={q}
                size="small"
                onClick={() => toggleTag(q)}
                variant="contained"
                sx={{
                  textTransform: "none",
                  borderRadius: "999px",
                  fontWeight: 700,
                  bgcolor: tags.includes(q) ? "#2CC1AE" : "#F3F4F6",
                  color: tags.includes(q) ? "white" : "#374151",
                  "&:hover": {
                    bgcolor: tags.includes(q) ? "#22B39E" : "#E5E7EB",
                  },
                }}
              >
                {q}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 1.5, mt: 2 }}>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading}
          sx={{
            bgcolor: "#22C55E",
            fontWeight: 800,
            textTransform: "none",
            px: 3,
            "&:hover": { bgcolor: "#16A34A" },
          }}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
        <Button
          onClick={handleBack}
          variant="contained"
          sx={{
            bgcolor: "#111827",
            color: "white",
            textTransform: "none",
            fontWeight: 700,
            px: 3,
            "&:hover": { bgcolor: "#0B1220" },
          }}
        >
          Cancel
        </Button>
      </Box>
    </div>
  );
}

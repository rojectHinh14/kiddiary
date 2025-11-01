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

/** Utility */
function toMinutes(hhmm) {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
function minutesSpan(start, end) {
  if (start == null || end == null) return 0;
  // cho phép băng qua nửa đêm
  if (end < start) return 24 * 60 - start + end;
  return end - start;
}

/** Phân loại night/day
 *  - Nếu phần lớn thời gian nằm trong [19:00, 07:00] hoặc end < start (qua nửa đêm) => Night
 *  - Ngược lại => Day
 */
function classifySleep(startMin, endMin) {
  if (startMin == null || endMin == null) return null;
  const span = minutesSpan(startMin, endMin);
  const windowNightStart = 19 * 60; // 19:00
  const windowNightEnd = 7 * 60; // 07:00 (qua ngày)
  // tính số phút là ban đêm, xấp xỉ
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
    // chia 2 đoạn nếu qua nửa đêm
    addNightOverlap(startMin, 24 * 60);
    addNightOverlap(endMin, endMin + 24 * 60);
  }

  const ratioNight = span ? minutesNight / span : 0;
  // nếu qua nửa đêm hoặc tỷ lệ đêm >= 0.5 coi là Night
  if (endMin < startMin || ratioNight >= 0.5) return "night";
  return "day";
}

export default function SleepAddPage({
  onBack,
  onCancel,
  onSave,
  babyName = "Yến Nhi",
}) {
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [start, setStart] = useState("21:00");
  const [end, setEnd] = useState("05:00");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState([]);

  const startMin = useMemo(() => toMinutes(start), [start]);
  const endMin = useMemo(() => toMinutes(end), [end]);
  const type = useMemo(() => classifySleep(startMin, endMin), [startMin, endMin]);

  const ampm = (hhmm) => {
    if (!hhmm) return "";
    const h = Number(hhmm.split(":")[0]);
    return h < 12 ? "am" : "pm";
  };

  const toggleTag = (t) =>
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const qualitySuggestions = ["Good sleep", "Fussy", "Startled"];

  const handleSave = () => {
    const payload = {
      date,
      start,
      end,
      type, // 'night' | 'day'
      notes,
      tags,
      durationMinutes: minutesSpan(startMin, endMin),
    };
    if (onSave) onSave(payload);
  };

  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <IconButton
          onClick={onBack || onCancel}
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
              placeholder=""
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                width: "100%",
              }}
            />
          </Box>

          {/* Suggestions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 2 }}>
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
                  "&:hover": { bgcolor: tags.includes(q) ? "#22B39E" : "#E5E7EB" },
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
          sx={{
            bgcolor: "#22C55E",
            fontWeight: 800,
            textTransform: "none",
            px: 3,
            "&:hover": { bgcolor: "#16A34A" },
          }}
        >
          Save
        </Button>
        <Button
          onClick={onCancel || onBack}
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

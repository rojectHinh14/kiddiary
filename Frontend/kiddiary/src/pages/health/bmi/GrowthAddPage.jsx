import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ChildCareRoundedIcon from "@mui/icons-material/ChildCareRounded";
import { useDispatch } from "react-redux";
import { createOneHistory } from "../../../store/slice/childHistoorySlice"; // đúng path slice bạn đang dùng

export default function GrowthAddPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { childId } = useParams(); // /home/health/growth/:childId/new

  const today = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(today);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");

    if (!date || !height || !weight) {
      setError("Vui lòng điền đầy đủ ngày, chiều cao và cân nặng");
      return;
    }

    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (!h || !w) {
      setError("Chiều cao và cân nặng phải là số hợp lệ");
      return;
    }

    try {
      setSubmitting(true);

      // Gọi thunk để tạo lịch sử mới
      await dispatch(
        createOneHistory({
          childId,
          payload: {
            date,
            height: h,
            weight: w,
          },
        })
      ).unwrap();

      // Quay lại trang growth của bé
      navigate(`/home/health/growth/${childId}`);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Thêm đo lường thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 max-w-full flex-wrap">
        <IconButton
          onClick={() => navigate(-1)}
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
          Add New Measurement 
        </Typography>
      </div>

      {/* Form */}
      <Box
        sx={{
          background: "#9EC6C3",
          borderRadius: "12px",
          p: 3,
          maxWidth: "100%",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 700, mb: 1, color: "#111827" }}>
            Date
          </Typography>
          <TextField
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            sx={{ bgcolor: "#FFF", borderRadius: 2 }}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 700, mb: 1, color: "#111827" }}>
            Height (cm)
          </Typography>
          <TextField
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            fullWidth
            sx={{ bgcolor: "#FFF", borderRadius: 2 }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 700, mb: 1, color: "#111827" }}>
            Weight (kg)
          </Typography>
          <TextField
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            fullWidth
            sx={{ bgcolor: "#FFF", borderRadius: 2 }}
          />
        </Box>

        {error && (
          <Typography sx={{ color: "red", mt: 1, fontSize: 14 }}>
            {error}
          </Typography>
        )}
      </Box>

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={submitting}
          sx={{
            bgcolor: "#22C55E",
            fontWeight: 700,
            textTransform: "none",
            px: 3,
            "&:hover": { bgcolor: "#16A34A" },
          }}
        >
          {submitting ? "Saving..." : "Save"}
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          disabled={submitting}
          sx={{
            bgcolor: "#374151",
            color: "#fff",
            fontWeight: 700,
            textTransform: "none",
            px: 3,
            "&:hover": { bgcolor: "#1F2937" },
          }}
        >
          Cancel
        </Button>
      </Box>
    </div>
  );
}

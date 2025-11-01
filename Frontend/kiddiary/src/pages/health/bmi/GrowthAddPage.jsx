import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  IconButton
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ChildCareRoundedIcon from "@mui/icons-material/ChildCareRounded";

export default function GrowthAddPage({ babyName = "Yến Nhi" }) {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const handleSave = () => {
    if (!date || !height || !weight) {
      alert("Please fill all fields");
      return;
    }

    const bmi = (parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2)).toFixed(1);
    console.log({ date, height, weight, bmi });

    navigate("/home/health/growth"); 
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
          Add New Measurement for
        </Typography>
        <Chip
          label={
            <div className="flex items-center gap-2">
              <span className="font-semibold">{babyName}</span>
              <ChildCareRoundedIcon className="text-rose-400" />
            </div>
          }
          sx={{
            bgcolor: "#A9D7D2",
            color: "#064E3B",
            borderRadius: "18px",
            height: 40,
            px: 1.5,
            fontWeight: 700,
          }}
        />
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
          <Typography sx={{ fontWeight: 700, mb: 1, color: "#111827" }}>Date</Typography>
          <TextField
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            sx={{ bgcolor: "#FFF", borderRadius: 2 }}
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
      </Box>

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            bgcolor: "#22C55E",
            fontWeight: 700,
            textTransform: "none",
            px: 3,
            "&:hover": { bgcolor: "#16A34A" },
          }}
        >
          Save
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
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

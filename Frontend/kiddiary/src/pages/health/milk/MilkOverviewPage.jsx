// src/pages/health/milk/MilkOverviewPage.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ChildCareRoundedIcon from "@mui/icons-material/ChildCareRounded";

export default function MilkOverviewPage({ babyName = "Yến Nhi" }) {
  const navigate = useNavigate();

  // mock today summary
  const todayTotalMl = 720;
  const todayList = [
    { time: "15:30", amount: 120, type: "Bottle" },
    { time: "12:00", amount: 90, type: "Bottle" },
  ];

  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-3">
          <IconButton
            onClick={() => navigate("/home/health")}
            sx={{ width: 40, height: 40, borderRadius: "999px", background: "#fff",
                  boxShadow: "0 2px 6px rgba(0,0,0,.08)" }}
          >
            <ArrowBackIosNewRoundedIcon fontSize="small" />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#374151" }}>
            Feeding Overview for
          </Typography>
          <Chip
            label={
              <div className="flex items-center gap-2">
                <span className="font-semibold">{babyName}</span>
                <ChildCareRoundedIcon className="text-rose-400" />
              </div>
            }
            sx={{ bgcolor: "#BFEDE1", color: "#066C61", borderRadius: "18px", height: 40, px: 1.5, fontWeight: 700 }}
          />
        </div>

        <Button
          startIcon={<AddRoundedIcon />}
          onClick={() => navigate("/home/health/milk/new")}
          sx={{
            bgcolor: "#FFEECF", color: "#5B4B22", fontWeight: 600, borderRadius: "12px",
            textTransform: "none", px: 2, py: 1, boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            "&:hover": { bgcolor: "#FFE3A3" },
          }}
        >
          Add Feeding
        </Button>
      </div>

      {/* Today card */}
      <Card elevation={0} sx={{ borderRadius: 4, background: "#FFF8EE", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <CardContent>
          <Typography sx={{ fontWeight: 700, color: "#374151", mb: 1 }}>Today</Typography>

          <div className="rounded-2xl bg-[#FFF1D5] p-4">
            <Typography sx={{ color: "#0F766E", fontWeight: 700 }}>Total Milk Today:</Typography>
            <Typography sx={{ fontSize: 48, fontWeight: 800, color: "#16837B", lineHeight: 1 }}>
              {todayTotalMl} <span className="text-2xl align-middle">ml</span>
            </Typography>

            <div className="mt-3 space-y-2">
              {todayList.map((i, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-full bg-[#CFE6FF] px-3 py-2 text-[#0b4a82]"
                >
                  <span className="font-semibold">{i.time}</span>
                  <span className="opacity-70">{i.type}</span>
                  <span className="font-semibold">{i.amount} ml</span>
                </div>
              ))}
              <div className="text-right text-sm italic text-[#A855F7] cursor-pointer"
                   onClick={() => navigate("/home/health/milk/history")}>
                see feeding history &gt;&gt;
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last 7 days (placeholder – plug in your chart later) */}
      <Card elevation={0} sx={{ mt: 4, borderRadius: 4, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <CardContent>
          <Typography sx={{ fontWeight: 700, color: "#374151", mb: 2 }}>Last 7 days</Typography>
          <Box sx={{ height: 220, borderRadius: 2, bgcolor: "#F9FAFB", border: "1px dashed #e5e7eb" }}
               className="flex items-center justify-center text-gray-500">
            (Your bar chart here)
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

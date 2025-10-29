import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Button,
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import BedtimeRoundedIcon from "@mui/icons-material/BedtimeRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import BabyChangingStationRoundedIcon from "@mui/icons-material/BabyChangingStationRounded";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const sleepData = [
  { day: "Mon", night: 8, dayNap: 2 },
  { day: "Tue", night: 9, dayNap: 1.5 },
  { day: "Wed", night: 7, dayNap: 2.5 },
  { day: "Thu", night: 6.5, dayNap: 1 },
  { day: "Fri", night: 8, dayNap: 2 },
  { day: "Sat", night: 8.5, dayNap: 2 },
  { day: "Sun", night: 9, dayNap: 2 },
];

export default function SleepTrackerPage({ onBack, babyName = "Yến Nhi" }) {
  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <IconButton
            onClick={onBack}
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

          <Typography variant="h5" sx={{ fontWeight: 700, color: "#374151" }}>
            Sleep Overview for
          </Typography>

          <Chip
            label={
              <div className="flex items-center gap-2">
                <span className="font-semibold">{babyName}</span>
                <BabyChangingStationRoundedIcon className="text-rose-400" />
              </div>
            }
            sx={{
              bgcolor: "#BFEDE1",
              color: "#066C61",
              borderRadius: "18px",
              height: 40,
              px: 1.5,
              fontWeight: 700,
            }}
          />
        </div>

        <Button
          startIcon={<AddRoundedIcon />}
          sx={{
            bgcolor: "#FFEECF",
            color: "#5B4B22",
            fontWeight: 600,
            borderRadius: "12px",
            textTransform: "none",
            px: 2,
            py: 1,
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            "&:hover": { bgcolor: "#FFE3A3" },
          }}
        >
          Add Sleep
        </Button>
      </div>

      {/* Today Card */}
      <Card elevation={0} sx={{ borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <CardContent sx={{ background: "#FFF6E5", borderRadius: 3, p: 3 }}>
          <Typography sx={{ color: "#374151", fontWeight: 600 }}>Today</Typography>

          <div className="flex justify-between items-center mt-3">
            <Typography sx={{ fontSize: 24, color: "#16837B", fontWeight: 700 }}>
              Total Sleep Today:
            </Typography>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 bg-[#BFEDE1] rounded-full px-3 py-1.5">
                <BedtimeRoundedIcon sx={{ color: "#0F766E" }} />
                <Typography sx={{ fontWeight: 600, color: "#0F766E" }}>Night Sleep: 8 hr</Typography>
              </div>
              <div className="flex items-center gap-2 bg-[#BFEDE1] rounded-full px-3 py-1.5">
                <WbSunnyRoundedIcon sx={{ color: "#0F766E" }} />
                <Typography sx={{ fontWeight: 600, color: "#0F766E" }}>Day Sleep: 2.5 hr</Typography>
              </div>
            </div>
          </div>

          <Typography sx={{ mt: 1, color: "#16837B", fontWeight: 700, fontSize: 40 }}>
            10 hr 30 min
          </Typography>

          <Typography
            sx={{
              mt: 1,
              fontSize: 14,
              color: "#0CA6A6",
              textAlign: "right",
              cursor: "pointer",
            }}
          >
            see sleep history &gt;&gt;
          </Typography>
        </CardContent>
      </Card>

      {/* Last 7 Days */}
      <Card elevation={0} sx={{ borderRadius: 16, mt: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontWeight: 700, color: "#374151", mb: 2 }}>
            Last 7 days
          </Typography>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sleepData} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="night" stackId="a" fill="#2CC1AE" name="Night Sleep" />
              <Bar dataKey="dayNap" stackId="a" fill="#9AE6B4" name="Day Sleep" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

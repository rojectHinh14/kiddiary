import * as React from "react";
import { useState, useEffect } from "react";
import {
  Avatar,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
  Tooltip,
  useMediaQuery,
  Menu,
  MenuItem,
} from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import VaccinesRoundedIcon from "@mui/icons-material/VaccinesRounded";
import LocalDrinkRoundedIcon from "@mui/icons-material/LocalDrinkRounded";
import HeightRoundedIcon from "@mui/icons-material/HeightRounded";
import BedtimeRoundedIcon from "@mui/icons-material/BedtimeRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import BabyChangingStationRoundedIcon from "@mui/icons-material/BabyChangingStationRounded";
import ScaleRoundedIcon from "@mui/icons-material/ScaleRounded";
import { getChildrenService } from "../../services/childService";
import { useNavigate } from "react-router-dom";

// ---------- helpers ----------
const Stat = ({ label, value, unit }) => (
  <div className="flex flex-col gap-1">
    <Typography sx={{ fontSize: 16, color: "#6b7280" }}>{label}</Typography>
    <div className="flex items-end gap-2">
      <Typography
        sx={{
          fontSize: { xs: 40, md: 52 },
          lineHeight: 1,
          fontWeight: 700,
          letterSpacing: "-0.5px",
          color: "#16837B",
        }}
      >
        {value}
      </Typography>
      {unit && (
        <Typography sx={{ fontSize: 18, mb: "4px", color: "#6b7280" }}>
          {unit}
        </Typography>
      )}
    </div>
  </div>
);

const Field = ({ label, value }) => (
  <div className="flex items-center gap-4">
    <Typography sx={{ color: "#475569", minWidth: 120, fontSize: 18 }}>
      {label}
    </Typography>
    <div
      className="inline-flex items-center px-4 py-2 rounded-[14px]"
      style={{
        background: "#fff",
        border: "2px solid #E7F4F1",
        boxShadow: "0 2px 0 rgba(0,0,0,0.06)",
      }}
    >
      <span style={{ color: "#16837B", fontWeight: 700 }}>{value}</span>
    </div>
  </div>
);

const Tile = ({ icon, title, bg, onClick }) => (
  <Card
    onClick={onClick}
    elevation={0}
    sx={{
      cursor: "pointer",
      borderRadius: 28,
      backgroundColor: bg,
      boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
      minHeight: 112,
      display: "flex",
      alignItems: "center",
    }}
  >
    <CardContent
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 2,
        py: 3,
        px: 4,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 999,
          background: "rgba(255,255,255,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.6)",
          flex: "0 0 auto",
        }}
      >
        {icon}
      </div>
      <Typography sx={{ fontWeight: 700, fontSize: 18, color: "#1f2937" }}>
        {title}
      </Typography>
    </CardContent>
  </Card>
);

// Helper functions
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let months =
    (today.getFullYear() - birthDate.getFullYear()) * 12 +
    (today.getMonth() - birthDate.getMonth());
  let days = today.getDate() - birthDate.getDate();
  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }
  const years = Math.floor(months / 12);
  months = months % 12;
  let ageStr = "";
  if (years > 0) ageStr += `${years} year${years > 1 ? "s" : ""} `;
  if (months > 0) ageStr += `${months} month${months > 1 ? "s" : ""} `;
  ageStr += `${days} day${days > 1 ? "s" : ""}`;
  return ageStr.trim();
};

const calculateWeeks = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  const diffTime = today - birthDate;
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays % 7;
  return `${weeks} week${weeks > 1 ? "s" : ""} ${days} day${
    days > 1 ? "s" : ""
  }`;
};

const getHeightInCm = (height) => {
  let heightCm = height;
  if (heightCm < 10) {
    heightCm *= 100; // Assume it's in meters if <10
  }
  return heightCm;
};

const calculateBMI = (weight, height) => {
  const heightCm = getHeightInCm(height);
  const heightM = heightCm / 100;
  return (weight / (heightM * heightM)).toFixed(1);
};

const getAvatarSrc = (avatarUrl) => {
  if (avatarUrl.startsWith("http")) {
    return avatarUrl;
  }
  return `http://localhost:8080${avatarUrl}`; // Adjust base URL if needed
};

// ---------- main component ----------
export default function BabyOverviewPanel({ onOpenVaccination, onOpenSleep }) {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setLoading(true);
        const res = await getChildrenService();
        if (res.data && res.data.errCode === 0) {
          setChildren(res.data.data || []);
          if (res.data.data && res.data.data.length > 0) {
            setSelectedChild(res.data.data[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching children:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectChild = (child) => {
    setSelectedChild(child);
    handleClose();
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <Typography>Loading...</Typography>
      </div>
    );
  }

  if (!selectedChild) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <Typography>No children found.</Typography>
      </div>
    );
  }

  const baby = {
    name: `${selectedChild.firstName.trim()} ${selectedChild.lastName}`,
    dob: new Date(selectedChild.dob).toLocaleDateString("vi-VN"),
    age: calculateAge(selectedChild.dob),
    weeks: calculateWeeks(selectedChild.dob),
    weight: selectedChild.weight,
    height: getHeightInCm(selectedChild.height),
    bmi: calculateBMI(selectedChild.weight, selectedChild.height),
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-white">
      {/* top card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 20,
          border: "1px solid #F1F5F9",
          background: "#FFF8EF",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Grid
            container
            spacing={20}
            alignItems="flex-start"
            sx={{ flexWrap: { xs: "wrap", md: "nowrap" } }}
          >
            <Grid item xs={12} md={6}>
              <div className="flex items-center gap-3 md:gap-4">
                <Avatar
                  sx={{ width: 44, height: 44 }}
                  src={getAvatarSrc(selectedChild.avatarUrl)}
                />
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "#E6FBF7",
                    color: "#066C61",
                    borderRadius: 18,
                    height: 40,
                    padding: "0 12px",
                    fontWeight: 700,
                  }}
                >
                  <span>{baby.name}</span>
                  <BabyChangingStationRoundedIcon sx={{ color: "#F87171" }} />
                </div>
                <Tooltip title="Switch baby">
                  <IconButton size="small" onClick={handleMenuClick}>
                    <ExpandMoreRoundedIcon />
                  </IconButton>
                </Tooltip>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4">
                <Field label="Date of Birth:" value={baby.dob} />
                <Field label="Age:" value={baby.age} />
                <Field label="Weeks:" value={baby.weeks} />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="grid grid-cols-2 gap-6 md:gap-8">
                <div className="flex items-start gap-3">
                  <ScaleRoundedIcon sx={{ mt: "2px", color: "#6b7280" }} />
                  <Stat label="Weight" value={baby.weight} unit="kg" />
                </div>
                <div className="flex items-start gap-3">
                  <HeightRoundedIcon sx={{ mt: "2px", color: "#6b7280" }} />
                  <Stat label="Height" value={baby.height} unit="cm" />
                </div>
                <div className="col-span-2 md:col-span-1 flex items-start gap-3">
                  <PsychologyRoundedIcon sx={{ mt: "2px", color: "#6b7280" }} />
                  <Stat label="BMI" value={baby.bmi} />
                </div>
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {children.map((child) => (
          <MenuItem
            key={child.id}
            onClick={() => handleSelectChild(child)}
            selected={selectedChild.id === child.id}
          >
            {`${child.firstName.trim()} ${child.lastName}`}
          </MenuItem>
        ))}
      </Menu>

      {/* tiles */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Tile
          title="Vaccination Schedule"
          icon={<VaccinesRoundedIcon />}
          bg="#F2CCFF"
          onClick={onOpenVaccination}
        />
        <Tile
          title="Daily Milk Log"
          icon={<LocalDrinkRoundedIcon />}
          bg="#CFE6FF"
        />
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Tile
        title="Weight, Height"
        icon={<ScaleRoundedIcon />}
        bg="#BFEDE1"
        onClick={() => navigate("/home/health/growth")}
      />
        <Tile
          title="Sleep Tracker"
          icon={<BedtimeRoundedIcon />}
          bg="#F3D2C9"
          onClick={onOpenSleep}
        />
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Tile
          title="Teething Tracker"
          icon={<PsychologyRoundedIcon />}
          bg="#FFE7D1"
        />
        <Tile
          title="Mood Tracker"
          icon={<PsychologyRoundedIcon />}
          bg="#CFEBD7"
        />
      </div>
    </div>
  );
}

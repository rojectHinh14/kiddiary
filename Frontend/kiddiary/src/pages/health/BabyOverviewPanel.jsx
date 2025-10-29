import * as React from "react";
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
} from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import VaccinesRoundedIcon from "@mui/icons-material/VaccinesRounded";
import LocalDrinkRoundedIcon from "@mui/icons-material/LocalDrinkRounded";
import HeightRoundedIcon from "@mui/icons-material/HeightRounded";
import BedtimeRoundedIcon from "@mui/icons-material/BedtimeRounded";
import PsychologyRoundedIcon from "@mui/icons-material/PsychologyRounded";
import BabyChangingStationRoundedIcon from "@mui/icons-material/BabyChangingStationRounded";
import ScaleRoundedIcon from "@mui/icons-material/ScaleRounded";

// ---------- helpers ----------
// ---------- helpers ----------
const Stat = ({ label, value, unit }) => (
  <div className="flex flex-col gap-1">
    <Typography sx={{ fontSize: 16, color: '#6b7280' }}>{label}</Typography>
    <div className="flex items-end gap-2">
      <Typography
        sx={{
          fontSize: { xs: 40, md: 52 },
          lineHeight: 1,
          fontWeight: 700,
          letterSpacing: '-0.5px',
          color: '#16837B',
        }}
      >
        {value}
      </Typography>
      {unit && (
        <Typography sx={{ fontSize: 18, mb: '4px', color: '#6b7280' }}>
          {unit}
        </Typography>
      )}
    </div>
  </div>
);

const Field = ({ label, value }) => (
  <div className="flex items-center gap-4">
    <Typography sx={{ color: '#475569', minWidth: 120, fontSize: 18 }}>
      {label}
    </Typography>
    <div
      className="inline-flex items-center px-4 py-2 rounded-[14px]"
      style={{
        background: '#fff',
        border: '2px solid #E7F4F1',
        boxShadow: '0 2px 0 rgba(0,0,0,0.06)',
      }}
    >
      <span style={{ color: '#16837B', fontWeight: 700 }}>{value}</span>
    </div>
  </div>
);

const Tile = ({ icon, title, bg, onClick }) => (
  <Card
    onClick={onClick}
    elevation={0}
    sx={{
      cursor: 'pointer',
      borderRadius: 28,           // giảm bo để không thành “viên thuốc” quá dài
      backgroundColor: bg,
      boxShadow: '0 6px 14px rgba(0,0,0,0.06)',
      minHeight: 112,             // CHỐT chiều cao
      display: 'flex',
      alignItems: 'center',
    }}
  >
    <CardContent
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
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
          background: 'rgba(255,255,255,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.6)',
          flex: '0 0 auto',
        }}
      >
        {icon}
      </div>
      <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#1f2937' }}>
        {title}
      </Typography>
    </CardContent>
  </Card>
);

// ---------- main component ----------
export default function BabyOverviewPanel({ onOpenVaccination , onOpenSleep }) {
  const baby = {
    name: 'Yến Nhi',
    dob: '31/10/2024',
    age: '11 months 28 days',
    weeks: '51 weeks 5 days',
    weight: 3.5,
    height: 60,
    bmi: 9.7,
  };

  return (
    // KHÔNG tô nền lớn ở ngoài nữa để tránh “tấm thảm” bo tràn
    <div className="p-4 md:p-6 lg:p-8">
      {/* top card */}
     <Card
  elevation={0}
  sx={{
    borderRadius: 20,                     // 24 -> 20
    border: '1px solid #F1F5F9',
    background: '#FFF8EF',                // nhẹ hơn chút
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  }}
>
 <CardContent sx={{ p: { xs: 2, md: 3 } }}>
   <Grid container spacing={20} alignItems="flex-start " sx={{ flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
     <Grid item xs={12} md={6}>
       <div className="flex items-center gap-3 md:gap-4">
         <Avatar sx={{ width: 44, height: 44 }} />
         <div
           style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    background: '#E6FBF7',
                    color: '#066C61',
                    borderRadius: 18,
                    height: 40,
                    padding: '0 12px',
                    fontWeight: 700,
                  }}
                >
                  <span>{baby.name}</span>
                  <BabyChangingStationRoundedIcon sx={{ color: '#F87171' }} />
                </div>
                <Tooltip title="Switch baby">
                  <IconButton size="small">
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
                  <ScaleRoundedIcon sx={{ mt: '2px', color: '#6b7280' }} />
                  <Stat label="Weight" value={baby.weight} unit="kg" />
                </div>
                <div className="flex items-start gap-3">
                  <HeightRoundedIcon sx={{ mt: '2px', color: '#6b7280' }} />
                  <Stat label="Height" value={baby.height} unit="cm" />
                </div>
                <div className="col-span-2 md:col-span-1 flex items-start gap-3">
                  <PsychologyRoundedIcon sx={{ mt: '2px', color: '#6b7280' }} />
                  <Stat label="BMI" value={baby.bmi} />
                </div>
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* tiles */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Tile
          title="Vaccination Schedule"
          icon={<VaccinesRoundedIcon />}
          bg="#F2CCFF"
          onClick={onOpenVaccination}   // <-- mở trang lịch tiêm
        />
        <Tile title="Daily Milk Log" icon={<LocalDrinkRoundedIcon />} bg="#CFE6FF" />
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Tile title="Weight, Height" icon={<ScaleRoundedIcon />} bg="#BFEDE1" />
      <Tile
  title="Sleep Tracker"
  icon={<BedtimeRoundedIcon />}
  bg="#F3D2C9"
  onClick={onOpenSleep}
/>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Tile title="Teething Tracker" icon={<PsychologyRoundedIcon />} bg="#FFE7D1" />
        <Tile title="Mood Tracker" icon={<PsychologyRoundedIcon />} bg="#CFEBD7" />
      </div>
    </div>
  );
}

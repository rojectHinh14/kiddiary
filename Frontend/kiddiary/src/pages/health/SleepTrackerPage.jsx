import React, { useMemo, useState } from "react";
import {
  Card, CardContent, Typography, Chip, IconButton, Button, TextField, Box
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import BedtimeRoundedIcon from "@mui/icons-material/BedtimeRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import BabyChangingStationRoundedIcon from "@mui/icons-material/BabyChangingStationRounded";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { useNavigate } from "react-router-dom";

const sleepData = [
  { day: "Mon", night: 8, dayNap: 2 },
  { day: "Tue", night: 9, dayNap: 1.5 },
  { day: "Wed", night: 7, dayNap: 2.5 },
  { day: "Thu", night: 6.5, dayNap: 1 },
  { day: "Fri", night: 8, dayNap: 2 },
  { day: "Sat", night: 8.5, dayNap: 2 },
  { day: "Sun", night: 9, dayNap: 2 },
];

/* ---------- utils cho phân loại night/day ---------- */
function toMinutes(hhmm){ if(!hhmm) return null; const [h,m]=hhmm.split(":").map(Number); return h*60+m; }
function span(start,end){ if(start==null||end==null) return 0; return end<start? 1440-start+end : end-start; }
function classify(start,end){
  if(start==null||end==null) return null;
  const winStart=19*60, winEnd=7*60; // 19:00~07:00
  let night=0;
  const ov=(s,e)=>{
    const a1=Math.max(s,winStart), b1=Math.min(e,1440); if(b1>a1) night+=b1-a1;
    const a2=Math.max(0,s-1440),  b2=Math.min(winEnd,e-1440);   if(b2>a2) night+=b2-a2;
  };
  if(end>=start){ ov(start,end); } else { ov(start,1440); ov(end,end+1440); }
  const r = span(start,end) ? night/span(start,end) : 0;
  return end<start || r>=0.5 ? "night" : "day";
}

function AddSleepSection({ babyName, onCancel, onSave }) {
  const [date,setDate]=useState(new Date().toISOString().slice(0,10));
  const [start,setStart]=useState("21:00");
  const [end,setEnd]=useState("05:00");
  const [notes,setNotes]=useState("");
  const [tags,setTags]=useState([]);
  const sMin=useMemo(()=>toMinutes(start),[start]);
  const eMin=useMemo(()=>toMinutes(end),[end]);
  const type=useMemo(()=>classify(sMin,eMin),[sMin,eMin]);
  const toggle=(t)=>setTags(p=>p.includes(t)?p.filter(x=>x!==t):[...p,t]);
  const ampm=(hhmm)=>{ if(!hhmm) return ""; const h=+hhmm.split(":")[0]; return h<12?"am":"pm"; };

  const handleSave=()=> {
    const payload={
      date, start, end, type,
      durationMinutes: span(sMin,eMin),
      notes, tags,
    };
    onSave?.(payload);
  };

  return (
    <Box sx={{ borderRadius: 3, bgcolor: "#9EC6C3", boxShadow: "0 6px 14px rgba(0,0,0,0.08)", p: 2.5 }}>
      {/* dòng tiêu đề nhỏ + chip trạng thái */}
      <Box sx={{ display:"grid", gridTemplateColumns:"1fr auto", alignItems:"center", mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#111827" }}>
          Add New Sleep for <Chip
            label={<span className="font-semibold">{babyName}</span>}
            icon={<BabyChangingStationRoundedIcon className="text-rose-400" />}
            sx={{ ml: 1, bgcolor:"#98CFC8", color:"#064E3B", borderRadius:"18px", height:36 }}
          />
        </Typography>
        <Box sx={{ display:"flex", alignItems:"center", gap:2 }}>
          <Typography sx={{ fontSize:13, color:"rgba(0,0,0,.7)", textAlign:"right" }}>
            Tự động cập nhật sau<br/>khi user input thời gian →
          </Typography>
          <Chip
            icon={type==="night"?<BedtimeRoundedIcon/>:<WbSunnyRoundedIcon/>}
            label={type==="night"?"Night sleep":"Day sleep"}
            sx={{ bgcolor: type==="night"?"#F4D1C7":"#FCE4B5", fontWeight:700, height:36, borderRadius:"999px" }}
          />
        </Box>
      </Box>

      {/* Date, time */}
      <Box sx={{ display:"flex", gap:4, flexWrap:"wrap", mb: 2 }}>
        <Box sx={{ minWidth:280 }}>
          <Typography sx={{ fontWeight:700, color:"#1F2937", mb: 1 }}>Date</Typography>
          <TextField type="date" value={date} onChange={e=>setDate(e.target.value)}
                     sx={{ bgcolor:"#fff", borderRadius:2, width:280 }}/>
        </Box>
        <Box>
          <Typography sx={{ fontWeight:700, color:"#1F2937", mb: 1 }}>Start time</Typography>
          <Box sx={{ display:"flex", alignItems:"center", gap:1.5 }}>
            <TextField type="time" value={start} onChange={e=>setStart(e.target.value)}
                       sx={{ bgcolor:"#fff", borderRadius:2 }}/>
            <Chip label={ampm(start)} sx={{ bgcolor:"#fff", borderRadius:"999px", height:36, fontWeight:700 }}/>
          </Box>
        </Box>
        <Box>
          <Typography sx={{ fontWeight:700, color:"#1F2937", mb: 1 }}>End time</Typography>
          <Box sx={{ display:"flex", alignItems:"center", gap:1.5 }}>
            <TextField type="time" value={end} onChange={e=>setEnd(e.target.value)}
                       sx={{ bgcolor:"#fff", borderRadius:2 }}/>
            <Chip label={ampm(end)} sx={{ bgcolor:"#fff", borderRadius:"999px", height:36, fontWeight:700 }}/>
          </Box>
        </Box>
      </Box>

      {/* Notes */}
      <Box sx={{ mb:1.5 }}>
        <Typography sx={{ fontWeight:700, color:"#1F2937", mb:1 }}>
          Sleep Quality Notes (Optional)
        </Typography>
        <TextField multiline minRows={5} value={notes} onChange={e=>setNotes(e.target.value)}
                   sx={{ bgcolor:"#fff", borderRadius:2, width:"100%" }}/>
      </Box>

      <Box sx={{ display:"flex", alignItems:"center", gap:1, flexWrap:"wrap", mb: 2 }}>
        {["Good sleep","Fussy","Startled"].map(t=>(
          <Button key={t} onClick={()=>toggle(t)} size="small" variant="contained"
                  sx={{
                    textTransform:"none", borderRadius:"999px", fontWeight:700,
                    bgcolor: tags.includes(t)?"#2CC1AE":"#F3F4F6",
                    color: tags.includes(t)?"white":"#374151",
                    "&:hover":{ bgcolor: tags.includes(t)?"#22B39E":"#E5E7EB" }
                  }}>
            {t}
          </Button>
        ))}
      
      </Box>

      {/* Actions */}
      <Box sx={{ display:"flex", gap:1.5 }}>
        <Button onClick={handleSave} variant="contained"
                sx={{ bgcolor:"#22C55E", textTransform:"none", fontWeight:800, px:3,
                      "&:hover":{ bgcolor:"#16A34A" }}}>
          Save
        </Button>
        <Button onClick={onCancel} variant="contained"
                sx={{ bgcolor:"#111827", color:"#fff", textTransform:"none", fontWeight:700, px:3,
                      "&:hover":{ bgcolor:"#0B1220" }}}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}

/* ---------- Trang SleepTracker; toggle section bằng state ---------- */
export default function SleepTrackerPage({ onBack, babyName = "Yến Nhi" }) {
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();
   const handleBack = () => {
    if (typeof onBack === "function") onBack();
    else navigate("/home/health");                // quay về Health overview trong layout
  };
  if (showAdd) {
    return (
      <div className="py-4">
        <div className="flex items-center gap-3 mb-4">
          <IconButton
            onClick={() => setShowAdd(false)}
            sx={{ width: 40, height: 40, borderRadius: "999px", background: "#FFF",
                  boxShadow: "0 2px 6px rgba(0,0,0,.08)", "&:hover": { background: "#FFF" } }}>
            <ArrowBackIosNewRoundedIcon fontSize="small" />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#374151" }}>
            Sleep Tracker
          </Typography>
        </div>

        <AddSleepSection
          babyName={babyName}
          onCancel={() => setShowAdd(false)}
          onSave={(payload) => {
            // TODO: gọi API lưu sleep ở đây
            // await sleepService.create(payload);
            setShowAdd(false);
          }}
        />
      </div>
    );
  }

  /* ----- View Overview (Today + Chart) ----- */
  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <IconButton
            onClick={handleBack}
            sx={{ width: 40, height: 40, borderRadius: "999px", background: "#FFF",
                  boxShadow: "0 2px 6px rgba(0,0,0,.08)", "&:hover": { background: "#FFF" } }}>
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
            sx={{ bgcolor: "#BFEDE1", color: "#066C61", borderRadius: "18px", height: 40, px: 1.5, fontWeight: 700 }}
          />
        </div>

        <Button
          startIcon={<AddRoundedIcon />}
          onClick={() => setShowAdd(true)}    // ✅ mở section Add
          sx={{
            bgcolor: "#FFEECF", color: "#5B4B22", fontWeight: 600, borderRadius: "12px",
            textTransform: "none", px: 2, py: 1, boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            "&:hover": { bgcolor: "#FFE3A3" },
          }}
        >
          Add Sleep
        </Button>
      </div>

      {/* Today */}
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
      onClick={() => navigate("/home/health/sleep/history")}
      sx={{ mt: 1, fontSize: 14, color: "#0CA6A6", textAlign: "right", cursor: "pointer" }}
    >
      see sleep history &gt;&gt;
    </Typography>
        </CardContent>
      </Card>

      {/* Last 7 Days */}
      <Card elevation={0} sx={{ borderRadius: 16, mt: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <CardContent sx={{ p: 3 }}>
          <Typography sx={{ fontWeight: 700, color: "#374151", mb: 2 }}>Last 7 days</Typography>
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

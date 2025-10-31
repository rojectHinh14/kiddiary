import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import VaccinesRoundedIcon from "@mui/icons-material/VaccinesRounded";
import BabyChangingStationRoundedIcon from "@mui/icons-material/BabyChangingStationRounded";
import CircleIcon from "@mui/icons-material/Circle";
import { useNavigate } from "react-router-dom";

// ===== Demo data =====
const vaccines = [
  {
    age: "0 – 24h after birth",
    name: "Hepatitis B (HBV)",
    time: "0 - 24h after giving birth",
    scheduledDose: "Dose 1: best to inject within 24 hours after birth",
    about:
      "Hepatitis B is a disease that is easily transmitted through injection (sharing needles/syringes), sexual intercourse, and from mother to child (during labor and delivery). The disease often causes liver cirrhosis, liver cancer, and has a great impact on public health.",
    vaccineNames: ["Engerix B", "Euvax B", "Hepavax"],
    details: `For newborns

* Standard 3-dose schedule
- Dose 1: first injection
- Dose 2: 1 month after dose one
- Dose 3: 6 months after dose one

* Special 4-dose schedule
- Dose 1: first injection
- Dose 2: 1 month after dose one
- Dose 3: 2 months after dose one
- Dose 4: 12 months after dose one

This schedule is used when combined with other vaccines, for children whose mothers are infected with Hepatitis B, people who have recently been exposed to the disease source, migrants, or those who cannot comply with the standard regimen. A booster shot is given after 5 years.`,
    sideEffects:
      "Swelling, warmth, and redness at the injection site for 1–2 days",
    required: "Yes",
    description:
      "• Dose 1 | Best to inject within 24 hours after birth\n• For newborns\n• Standard 3-dose schedule",
  },
  {
    age: "0 – 1 month",
    name: "Tuberculosis (BCG)",
    time: "Within 30 days after birth",
    scheduledDose: "Single 1-dose schedule",
    about:
      "BCG protects against severe forms of tuberculosis in infants and young children.",
    vaccineNames: ["BCG (various manufacturers)"],
    details:
      "Inject BCG as soon as possible within 30 days after birth. Single 1-dose schedule.",
    sideEffects: "Mild local reaction is common.",
    required: "Yes",
    description:
      "• Inject BCG as soon as possible within 30 days after birth\n• For newborns\n• Single 1-dose schedule",
  },
  {
    age: "1.5 – 2 months",
    name: "Rotavirus",
    time: "1.5 - 2 months",
    scheduledDose: "Oral vaccine, 2 or 3 doses depending on brand",
    about: "Prevents severe diarrhea caused by rotavirus.",
    vaccineNames: ["Rotarix (2-dose)", "RotaTeq (3-dose)"],
    details:
      "Oral Dose 1 for children 1.5 months old and above. Follow 2-dose or 3-dose schedule based on brand.",
    sideEffects: "Mild diarrhea or irritability may occur.",
    required: "Recommended",
    description:
      "• Oral Dose 1 for children 1.5 months old and above\n• 2-dose or 3-dose schedule depending on brand",
  },
];

// ===== helper: status meta =====
const STATUS_META = {
  none: { label: "Update", color: "#F871A0", text: "#fff" },
  not_yet: { label: "Not injected", color: "#E5E7EB", text: "#111827" },
  done: { label: "Injected", color: "#34D399", text: "#064E3B" },
  skipped: { label: "Skipped", color: "#FCD34D", text: "#78350F" },
};

function StatusChip({ status }) {
  const meta = STATUS_META[status || "none"];
  return (
    <Chip
      label={meta.label}
      icon={
        status && status !== "none" ? (
          <CircleIcon sx={{ fontSize: 10, color: meta.text }} />
        ) : undefined
      }
      sx={{
        bgcolor: meta.color,
        color: meta.text,
        fontWeight: 700,
        px: 1,
        "& .MuiChip-icon": { color: meta.text, ml: "4px" },
      }}
    />
  );
}

// ===== Dialog for Update =====
function UpdateDialog({ open, onClose, data, onSave }) {
  const [status, setStatus] = useState(data?.status || "not_yet");
  const [date, setDate]   = useState(data?.date || "");
  const [note, setNote]   = useState(data?.note || "");

  if (!data) return null;

  const LabelCell = ({ children }) => (
    <Box
      sx={{
        bgcolor: "#E3EBF6",            // xám-xanh như ảnh
        color: "#1F2937",
        fontWeight: 700,
        fontSize: 14,
        px: 2,
        py: 1.25,
        borderRight: "1px solid #D1D5DB",
        minWidth: 220,                // cố định cột trái
      }}
    >
      {children}
    </Box>
  );

  const Row = ({ label, children }) => (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        borderBottom: "1px solid #D1D5DB",
      }}
    >
      <LabelCell>{label}</LabelCell>
      <Box sx={{ px: 2, py: 1.25 }}>{children}</Box>
    </Box>
  );

  const StatusDot = ({ color }) => (
    <Box sx={{
      width: 8, height: 8, borderRadius: "50%",
      bgcolor: color, mr: 1
    }}/>
  );

  const statusMeta = {
    not_yet: { label: "Not injected", color: "#374151" },
    done:    { label: "Injected",     color: "#10B981" },
    skipped: { label: "Skipped",      color: "#F59E0B" },
  };

  const handleSave = () => onSave({ status, date, note });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: "hidden",
        },
      }}
    >
      {/* Title sticky */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          bgcolor: "#fff",
          borderBottom: "1px solid #E5E7EB",
          px: 3,
          py: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#111827" }}>
          Vaccination schedule: {data.name}
        </Typography>
      </Box>

      {/* Content scrollable */}
      <DialogContent
        sx={{
          p: 0,
          maxHeight: "80vh",
        }}
      >
        <Row label="Vaccine">
          <Typography sx={{ fontWeight: 700 }}>{data.name}</Typography>
        </Row>

        <Row label="Child">
          <Typography>Yen Nhi 🍼</Typography>
        </Row>

        <Row label="Time">
          <Typography>{data.time || "-"}</Typography>
        </Row>

        {/* Status + Date cùng hàng */}
        <Row label="Status">
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel id="vax-status">Status</InputLabel>
              <Select
                labelId="vax-status"
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                renderValue={(v) => (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <StatusDot color={statusMeta[v].color} />
                    <span>{statusMeta[v].label}</span>
                  </Box>
                )}
              >
                {Object.entries(statusMeta).map(([k, v]) => (
                  <MenuItem key={k} value={k}>
                    <StatusDot color={v.color} /> {v.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              size="small"
              type="date"
              label="Date"
              InputLabelProps={{ shrink: true }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Box>
        </Row>

        <Row label="Scheduled Dose">
          <Typography>{data.scheduledDose || "-"}</Typography>
        </Row>

        <Row label="About">
          <Typography sx={{ whiteSpace: "pre-wrap" }}>{data.about || "-"}</Typography>
        </Row>

        <Row label="Vaccine Name">
          {data.vaccineNames ? (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {data.vaccineNames.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          ) : (
            "-"
          )}
        </Row>

        <Row label="Details">
          <Typography sx={{ whiteSpace: "pre-wrap" }}>{data.details || "-"}</Typography>
        </Row>

        {data.sideEffects && (
          <Row label="Side Effects">
            <Typography sx={{ whiteSpace: "pre-wrap" }}>{data.sideEffects}</Typography>
          </Row>
        )}

        <Row label="Required?">
          <Typography>{data.required || "-"}</Typography>
        </Row>

        <Row label="Note">
          <TextField
            fullWidth
            multiline
            minRows={3}
            placeholder="Leave your note here"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Row>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 2.5, py: 1.75, borderTop: "1px solid #E5E7EB" }}>
        <Button
          onClick={onClose}
          variant="text"
          sx={{ fontWeight: 700, color: "#374151" }}
        >
          CANCEL
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            bgcolor: "#22C55E",
            fontWeight: 800,
            px: 3,
            "&:hover": { bgcolor: "#16A34A" },
          }}
        >
          SAVE
        </Button>
      </DialogActions>
    </Dialog>
  );
}


// ===== Main page (table-like) =====
export default function VaccinationSchedulePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  // map lưu trạng thái từng hàng: { [index]: {status, date, note} }
  const [statusMap, setStatusMap] = useState({});

  const openUpdate = (v, idx) => {
    setSelected({ ...v, idx, ...(statusMap[idx] || {}) });
  };

  const handleSave = (payload) => {
    setStatusMap((m) => ({ ...m, [selected.idx]: payload }));
    setSelected(null);
  };

  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
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
          <div className="w-10 h-10 rounded-full bg-[#FFE7F7] flex items-center justify-center shadow-sm">
            <VaccinesRoundedIcon />
          </div>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#374151" }}>
            Vaccination schedule
          </Typography>
        </div>
        <Button
  onClick={() => navigate("/home/health/vaccination/summary")}
  sx={{
    bgcolor: "#1B9C9E",
    color: "#FFFBEF",
    fontWeight: 700,
    textTransform: "none",
    fontSize: "0.9rem",
    borderRadius: "999px",
    px: 2.5,
    py: 0.7,
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    transition: "all 0.2s ease",
    "&:hover": {
      bgcolor: "#138C8E",
      boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
    },
  }}
>
  Summary
</Button>
      </div>

      {/* Table-like layout */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid #E5E7EB",
          boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Header row */}
          <div className="grid grid-cols-3 bg-[#38BDF8] text-white font-semibold text-center py-3">
            <div>Vaccine name</div>
            <div>Vaccine &amp; Recommended Time</div>
            <div>Status</div>
          </div>

          {/* Body rows */}
          {vaccines.map((v, idx) => {
            const st = statusMap[idx]?.status || "none";
            const meta = STATUS_META[st];

            return (
              <div
                key={idx}
                className={`grid grid-cols-3 text-sm ${
                  idx % 2 === 0 ? "bg-[#F0F9FF]" : "bg-white"
                } border-t border-[#E5E7EB]`}
              >
                <div className="p-4 text-center font-medium text-slate-700 border-r border-[#E5E7EB]">
                  {v.age}
                </div>

                <div className="p-4 text-slate-700 whitespace-pre-wrap border-r border-[#E5E7EB]">
                  <span className="font-semibold text-[#0284C7]">{v.name}</span>
                  <br />
                  {v.description}
                </div>

                <div className="p-4 flex items-center justify-center">
                  <Button
                    variant="contained"
                    onClick={() => openUpdate(v, idx)}
                    sx={{
                      bgcolor: meta.color,
                      color: meta.text,
                      textTransform: "none",
                      fontWeight: 700,
                      "&:hover": { filter: "brightness(0.95)" },
                    }}
                    startIcon={
                      st !== "none" ? (
                        <CircleIcon sx={{ fontSize: 10, color: meta.text }} />
                      ) : null
                    }
                  >
                    {meta.label}
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Update dialog */}
      <UpdateDialog
        open={!!selected}
        onClose={() => setSelected(null)}
        data={selected}
        onSave={handleSave}
      />
    </div>
  );
}

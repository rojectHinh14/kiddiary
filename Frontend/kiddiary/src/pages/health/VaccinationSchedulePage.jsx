import React, { useState } from "react";
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import VaccinesRoundedIcon from "@mui/icons-material/VaccinesRounded";
import BabyChangingStationRoundedIcon from "@mui/icons-material/BabyChangingStationRounded";

// --- demo data for table ---
const rows = [
  {
    age: "Newborn (0 month)",
    items: [
      "Hepatitis B (1st dose, within 24 hrs)",
      "BCG (Tuberculosis, as soon as possible)",
    ],
    doses: 2,
    primaryVaccine: "Hepatitis B",
    time: "0 - 24h after giving birth",
  },
  {
    age: "2 months",
    items: [
      "6-in-1 (1st dose, 8 weeks old)",
      "Pneumococcal (1st dose, 8–10 weeks)",
      "Rotavirus (1st dose, before 12 weeks)",
    ],
    doses: 3,
    primaryVaccine: "6-in-1",
    time: "at 8 weeks old",
  },
  {
    age: "3 months",
    items: ["6-in-1 (2nd dose)", "Pneumococcal (2nd dose)", "Rotavirus (2nd dose)"],
    doses: 3,
    primaryVaccine: "6-in-1",
    time: "1 month after dose one",
  },
  {
    age: "4 months",
    items: [
      "6-in-1 (3rd dose)",
      "Rotavirus (3rd dose, if 3-dose type)",
      "Pneumococcal (3rd dose)",
    ],
    doses: 3,
    primaryVaccine: "6-in-1",
    time: "1 month after previous dose",
  },
  {
    age: "6 months",
    items: [
      "Influenza (1st dose, before flu season)",
      "Hepatitis B (3rd dose, if not completed)",
    ],
    doses: 2,
    primaryVaccine: "Influenza",
    time: "6 months old",
  },
  { age: "9 months", items: ["Measles (1st dose)"], doses: 1, primaryVaccine: "Measles", time: "9 months" },
  {
    age: "12 months (1 year)",
    items: [
      "Japanese Encephalitis (1st dose)",
      "Chickenpox (1st dose)",
      "Pneumococcal booster",
    ],
    doses: 3,
    primaryVaccine: "Japanese Encephalitis",
    time: "12 months",
  },
  {
    age: "15–18 months",
    items: ["MMR (1st dose)", "Japanese Encephalitis (2nd dose)", "6-in-1 booster"],
    doses: 3,
    primaryVaccine: "MMR",
    time: "15–18 months",
  },
];

// --- detailed content for popup (example: Hepatitis B) ---
const VACCINE_DETAILS = {
  "Hepatitis B": {
    about:
      "Hepatitis B is a disease easily transmitted through injection (sharing needles/syringes), sexual intercourse, and from mother to child (during labor and delivery). It can cause liver cirrhosis and cancer and has a great impact on public health.",
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
    scheduledDose: "Dose 1: best to inject within 24 hours after birth",
  },
};

// ---------- small components ----------
function DoseDots({ count = 3, onClick }) {
  return (
    <div className="flex gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onClick?.(i + 1)}
          className="w-9 h-9 rounded-full bg-[#FFF4DC] text-[#4B5563] flex items-center justify-center shadow-inner"
          style={{ boxShadow: "inset 0 0 0 2px #F2E5BC" }}
          title={`Dose ${i + 1}`}
        >
          <span className="font-semibold">{i + 1}</span>
        </button>
      ))}
    </div>
  );
}

// ---------- popup dialog ----------
function VaccineDetailDialog({ open, onClose, data }) {
  const [status, setStatus] = useState("not_yet");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  if (!data) return null;

  const details = VACCINE_DETAILS[data.vaccine] || {};
  const save = () => {
    // chỗ này bạn call API lưu trạng thái nếu muốn
    console.log("SAVE VACCINE", { ...data, status, date, note });
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Vaccination schedule: <span style={{ fontWeight: 600 }}>{data.vaccine}</span>
      </DialogTitle>
      <DialogContent dividers sx={{ bgcolor: "#F3F4F6" }}>
        {/* Vaccine */}
        <Row label="Vaccine" value={data.vaccine} />
        <Row label="Child" value={`${data.child} 👶`} />
        <Row label="Time" value={data.time || "-"} />

        {/* Status */}
        <div className="grid grid-cols-3 gap-3 items-center py-2">
          <div className="text-sm font-semibold text-slate-700">Status</div>
          <div className="col-span-2">
            <div className="flex items-center gap-3">
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel id="vax-status">Status</InputLabel>
                <Select
                  labelId="vax-status"
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="not_yet">Not yet</MenuItem>
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                  <MenuItem value="done">Done</MenuItem>
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
            </div>
          </div>
        </div>

        <Row label="Scheduled Dose" value={details.scheduledDose || "-"} />
        <Row label="About" value={details.about || "—"} multiline />

        <Row
          label="Vaccine Name"
          value={
            details.vaccineNames
              ? "• " + details.vaccineNames.join("\n• ")
              : "—"
          }
          multiline
        />
        <Row label="Details" value={details.details || "—"} multiline />
        <Row label="Side Effects" value={details.sideEffects || "—"} multiline />
        <Row label="Required?" value={details.required || "—"} />

        <div className="grid grid-cols-3 gap-3 items-start py-2">
          <div className="text-sm font-semibold text-slate-700">Note</div>
          <div className="col-span-2">
            <TextField
              placeholder="Leave your note here"
              multiline
              minRows={3}
              fullWidth
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.5 }}>
        <Button onClick={onClose} variant="text" color="inherit">
          Cancel
        </Button>
        <Button onClick={save} variant="contained" sx={{ bgcolor: "#2CC1AE" }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Row({ label, value, multiline }) {
  return (
    <div className="grid grid-cols-3 gap-3 items-start py-2">
      <div className="text-sm font-semibold text-slate-700">{label}</div>
      <div className="col-span-2">
        {multiline ? (
          <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans">
            {value}
          </pre>
        ) : (
          <div className="text-sm text-slate-700">{value}</div>
        )}
      </div>
    </div>
  );
}

// ---------- main page ----------
export default function VaccinationSchedulePage({ onBack, babyName = "Yến Nhi" }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const openDetail = (row, dose) => {
    setSelected({
      vaccine: row.primaryVaccine || "Vaccine",
      dose,
      child: babyName,
      time: row.time,
    });
    setDialogOpen(true);
  };

  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
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

          <div className="w-10 h-10 rounded-full bg-[#FFE7F7] flex items-center justify-center shadow-sm">
            <VaccinesRoundedIcon />
          </div>

          <Typography variant="h5" sx={{ fontWeight: 700, color: "#374151" }}>
            Vaccination schedule
          </Typography>
        </div>

        <Chip
          label={
            <div className="flex items-center gap-2">
              <span className="font-semibold">{babyName}</span>
              <BabyChangingStationRoundedIcon className="text-rose-400" />
            </div>
          }
          sx={{
            bgcolor: "#E6FBF7",
            color: "#066C61",
            borderRadius: "18px",
            height: 40,
            px: 1.5,
            fontWeight: 700,
          }}
        />
      </div>

      {/* Table */}
      <Card elevation={0} sx={{ borderRadius: 18, overflow: "hidden", boxShadow: "0 6px 14px rgba(0,0,0,.06)" }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#E5E7EB" }}>
                  <TableCell
                    align="center"
                    sx={{ width: 180, fontWeight: 700, color: "#374151", textAlign: "center" }}
                  >
                    Age
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ fontWeight: 700, color: "#374151", textAlign: "center" }}
                  >
                    Vaccine &amp; Recommended Time
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ width: 220, fontWeight: 700, color: "#374151", textAlign: "center" }}
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((r, idx) => (
                  <TableRow key={idx} sx={{ "& td": { borderColor: "#D1D5DB" }, background: "#FFF" }}>
                    <TableCell sx={{ background: "#F3F4F6", color: "#374151", fontWeight: 600 }}>
                      {r.age}
                    </TableCell>
                    <TableCell>
                      <ul className="list-disc pl-4 text-[#374151]">
                        {r.items.map((t, i) => (
                          <li key={i} className="leading-6">{t}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell align="center">
                      <DoseDots
                        count={r.doses || 3}
                        onClick={(dose) => openDetail(r, dose)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Dialog */}
      <VaccineDetailDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        data={selected}
      />
    </div>
  );
}

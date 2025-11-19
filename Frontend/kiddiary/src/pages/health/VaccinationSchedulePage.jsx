import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import VaccinesRoundedIcon from "@mui/icons-material/VaccinesRounded";
import CircleIcon from "@mui/icons-material/Circle";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios"; // file axios đã cấu hình baseURL

import { loadChildren } from "../../store/slice/childrenSlice";

// ==================== SẮP XẾP THEO TUỔI ====================
const parseAgeToMonths = (ageStr) => {
  if (!ageStr) return Infinity;
  const s = ageStr.trim().toLowerCase();
  if (s.includes("birth") || s.includes("24h") || s.includes("giờ")) return 0;

  const match = s.match(
    /(\d+)\s*(-|–|to)?\s*(\d+)?\s*(month|months|tháng|year|years|năm|tuổi)/i
  );
  if (!match) return Infinity;

  let num = parseInt(match[1], 10);
  const unit = match[4].toLowerCase();
  if (unit.includes("year") || unit.includes("năm") || unit.includes("tuổi"))
    num *= 12;
  return num;
};

const sortByRecommendedAge = (vaccines) => {
  return [...vaccines].sort((a, b) => {
    const monthsA = parseAgeToMonths(a.dose.recommendedAge);
    const monthsB = parseAgeToMonths(b.dose.recommendedAge);
    if (monthsA !== monthsB) return monthsA - monthsB;
    return a.dose.doseNumber - b.dose.doseNumber;
  });
};

// ==================== TRẠNG THÁI ====================
const STATUS_CONFIG = {
  not_injected: { label: "Not Injected", color: "#F871A0", text: "#fff" },
  injected: { label: "Injected", color: "#34D399", text: "#fff" },
  skipped: { label: "Skipped", color: "#FCD34D", text: "#78350F" },
};

// ==================== DIALOG CẬP NHẬT ====================
function UpdateDialog({ open, onClose, data, onSave, saving }) {
  const [status, setStatus] = useState("not_injected");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (data) {
      setStatus(data.status || "not_injected");
      setDate(data.injectedDate ? data.injectedDate.slice(0, 10) : "");
      setNote(data.note || "");
    }
  }, [data]);

  if (!open) return null;

  const Row = ({ label, children }) => (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <Box
        sx={{
          bgcolor: "#f1f5f9",
          fontWeight: 700,
          px: 3,
          py: 2,
          borderRight: "1px solid #e5e7eb",
        }}
      >
        {label}
      </Box>
      <Box sx={{ px: 3, py: 2 }}>{children}</Box>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box
        sx={{
          p: 3,
          borderBottom: "1px solid #e5e7eb",
          bgcolor: "white",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Typography variant="h6" fontWeight={800}>
          Update Vaccination Status
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {data?.childName} • {data?.vaccinationType} (Dose {data?.doseNumber})
        </Typography>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        <Row label="Vaccine">
          <div>
            <Typography fontWeight={700}>{data?.vaccinationType}</Typography>
            <Typography variant="body2" color="text.secondary">
              {data?.diseaseName}
            </Typography>
          </div>
        </Row>
        <Row label="About">{data.about}</Row>
        <Row label="Vaccine Name">Dose {data?.vaccineName}</Row>
        <Row label="Recommended Age">{data?.recommendedAge}</Row>
        <Row label="Description">
          <Typography sx={{ whiteSpace: "pre-wrap", fontSize: "0.95rem" }}>
            {data?.doseDescription || "-"}
          </Typography>
        </Row>
        <Row label="Side Effects">{data.symptoms}</Row>
        <Row label="Status">
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="not_injected">Not Injected</MenuItem>
                <MenuItem value="injected">Injected</MenuItem>
                <MenuItem value="skipped">Skipped</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              type="date"
              label="Injection Date"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                inputProps: { max: new Date().toISOString().split("T")[0] },
              }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Box>
        </Row>
        <Row label="Note">
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Add note (clinic, reaction, etc.)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Row>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: "1px solid #e5e7eb", gap: 2 }}>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() =>
            onSave({
              status,
              date: date ? `${date}T12:00:00.000Z` : null,
              note,
            })
          }
          disabled={saving}
          startIcon={saving && <CircularProgress size={16} />}
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ==================== MAIN COMPONENT ====================
export default function VaccinationSchedulePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { childId } = useParams();

  const children = useSelector((state) => state.children?.list || []);
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Load children list
  useEffect(() => {
    if (!children.length) dispatch(loadChildren());
  }, [dispatch, children.length]);

  // Load vaccines for child
  const loadVaccines = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/children/${childId}/vaccines`);
      if (res.data.errCode === 0) {
        const sorted = sortByRecommendedAge(res.data.data);
        setVaccines(sorted);
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to load vaccines",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (childId) loadVaccines();
  }, [childId]);

  const child = children.find((c) => String(c.id) === String(childId));

  const openUpdate = (item) => {
    const { dose, status, injectedDate, note } = item;
    const vaccine = dose.vaccine;

    setSelected({
      recordId: item.id, // id của bảng child_vaccines (cần để update)
      vaccineDoseId: dose.id, // vaccineDoseId trong bảng dose
      childName: `${child?.firstName} ${child?.lastName}`.trim(),
      vaccineName: vaccine.vaccineName,
      vaccinationType: vaccine.vaccinationType,
      diseaseName: vaccine.diseaseName,
      about: vaccine.about,
      symptoms: vaccine.symptoms,
      status,
      injectedDate,
      note: note || "",
      doseNumber: dose.doseNumber,
      recommendedAge: dose.recommendedAge,
      doseDescription: dose.doseDescription,
    });
  };

  // GỌI API LƯU THẬT
  const handleSave = async ({ status, date, note }) => {
    if (!selected) return;

    setSaving(true);
    try {
      const payload = {
        childId: Number(childId),
        vaccineDoseId: selected.vaccineDoseId,
        status,
        injectedDate: date,
        note: note || null,
      };

      const res = await axios.put("/api/vaccines/dose-status", payload);

      if (res.data.errCode === 0) {
        // Cập nhật local state
        setVaccines((prev) =>
          prev.map((v) =>
            v.dose.id === selected.vaccineDoseId
              ? { ...v, status, injectedDate: date, note }
              : v
          )
        );

        setSnackbar({
          open: true,
          message: "Vaccination status updated successfully!",
          severity: "success",
        });
        setSelected(null);
      }
    } catch (err) {
      const msg =
        err.response?.data?.errMessage || "Failed to update. Please try again.";
      setSnackbar({ open: true, message: msg, severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (!child)
    return (
      <Typography align="center" py={10}>
        Child not found
      </Typography>
    );

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ bgcolor: "white", boxShadow: 2 }}
          >
            <ArrowBackIosNewRoundedIcon />
          </IconButton>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
              <VaccinesRoundedIcon sx={{ color: "#ec4899" }} />
            </div>
            <div>
              <Typography variant="h5" fontWeight={800}>
                Vaccination Schedule
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {child.firstName} {child.lastName} • DOB:{" "}
                {child.dob
                  ? new Date(child.dob).toLocaleDateString("en-GB")
                  : "-"}
              </Typography>
            </div>
          </div>
        </div>

        <Button
          variant="contained"
          sx={{ borderRadius: 28, px: 4, fontWeight: 700 }}
          onClick={() =>
            navigate(`/home/health/vaccination/summary/${childId}`)
          }
        >
          View Summary
        </Button>
      </div>

      {/* Loading */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={12}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Card sx={{ borderRadius: 4, overflow: "hidden", boxShadow: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <div className="grid grid-cols-12 font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 py-4 text-center">
              <div className="col-span-4">Vaccine</div>
              <div className="col-span-2">Dose</div>
              <div className="col-span-4">Recommended Age</div>
              <div className="col-span-2">Status</div>
            </div>

            {vaccines.map((item, idx) => {
              const { dose, status } = item;
              const vaccine = dose.vaccine;
              const config =
                STATUS_CONFIG[status] || STATUS_CONFIG.not_injected;

              return (
                <div
                  key={item.id}
                  className={`grid grid-cols-12 text-sm border-t ${
                    idx % 2 === 0 ? "bg-blue-50" : "bg-white"
                  } hover:bg-blue-100 transition`}
                >
                  <div className="col-span-4 p-4 border-r">
                    <div className="font-semibold">
                      {vaccine.vaccinationType}
                    </div>
                    <div className="text-xs text-gray-600">
                      {vaccine.diseaseName}
                    </div>
                  </div>
                  <div className="col-span-2 p-4 border-r text-center font-medium">
                    Dose {dose.doseNumber}
                  </div>
                  <div className="col-span-4 p-4 border-r">
                    <div className="font-medium">{dose.recommendedAge}</div>
                    <div className="text-xs text-gray-600 mt-1 whitespace-pre-wrap">
                      {dose.doseDescription}
                    </div>
                  </div>
                  <div className="col-span-2 p-4 flex justify-center">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => openUpdate(item)}
                      sx={{
                        bgcolor: config.color,
                        color: config.text,
                        fontWeight: 700,
                        textTransform: "none",
                        minWidth: 120,
                        "&:hover": { filter: "brightness(0.9)" },
                      }}
                      startIcon={
                        status !== "not_injected" ? (
                          <CircleIcon sx={{ fontSize: 10 }} />
                        ) : null
                      }
                    >
                      {config.label}
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Dialog & Snackbar */}
      <UpdateDialog
        open={!!selected}
        onClose={() => !saving && setSelected(null)}
        data={selected}
        onSave={handleSave}
        saving={saving}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

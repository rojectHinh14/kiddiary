import React, { useEffect, useState } from "react";
import {
  Card, CardContent, IconButton, Typography, Button, Dialog,
  DialogContent, DialogActions, TextField, Chip, MenuItem, Select,
  InputLabel, FormControl, Box, CircularProgress,
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import VaccinesRoundedIcon from "@mui/icons-material/VaccinesRounded";
import CircleIcon from "@mui/icons-material/Circle";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  loadVaccinesForAllChildren,
  saveVaccineStatus,
} from "../../store/slice/vaccinationSlice";
import { loadChildren } from "../../store/slice/childrenSlice";

// ===== helper: status meta (UPPERCASE để khớp AllCode.keyMap) =====
const STATUS_META = {
  NONE:    { label: "Update",       color: "#F871A0", text: "#fff" },
  NOT_YET: { label: "Not injected", color: "#E5E7EB", text: "#111827" },
  DONE:    { label: "Injected",     color: "#34D399", text: "#064E3B" },
  SKIPPED: { label: "Skipped",      color: "#FCD34D", text: "#78350F" },
};

function UpdateDialog({ open, onClose, data, onSave }) {
  const [status, setStatus] = useState(data?.status || "NOT_YET");
  const [date, setDate]     = useState(data?.updateTime?.slice(0, 10) || "");
  const [note, setNote]     = useState(data?.note || "");

  useEffect(() => {
    setStatus(data?.status || "NOT_YET");
    setDate(data?.updateTime?.slice(0, 10) || "");
    setNote(data?.note || "");
  }, [data]);

  if (!data) return null;

  const statusOptions = [
    { key: "NOT_YET", label: STATUS_META.NOT_YET.label },
    { key: "DONE",    label: STATUS_META.DONE.label },
    { key: "SKIPPED", label: STATUS_META.SKIPPED.label },
  ];

  const Row = ({ label, children }) => (
    <Box sx={{ display: "grid", gridTemplateColumns: "220px 1fr", borderBottom: "1px solid #D1D5DB" }}>
      <Box sx={{ bgcolor: "#E3EBF6", color: "#1F2937", fontWeight: 700, fontSize: 14, px: 2, py: 1.25, borderRight: "1px solid #D1D5DB" }}>
        {label}
      </Box>
      <Box sx={{ px: 2, py: 1.25 }}>{children}</Box>
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2, overflow: "hidden" } }}>
      <Box sx={{ position: "sticky", top: 0, zIndex: 1, bgcolor: "#fff", borderBottom: "1px solid #E5E7EB", px: 3, py: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "#111827" }}>
          Vaccination update — {data.childName} • {data.vaccine?.name}
        </Typography>
      </Box>

      <DialogContent sx={{ p: 0, maxHeight: "80vh" }}>
        <Row label="Vaccine"><Typography sx={{ fontWeight: 700 }}>{data.vaccine?.name}</Typography></Row>
        <Row label="Child"><Typography>{data.childName}</Typography></Row>

        <Row label="Status">
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <FormControl size="small" sx={{ minWidth: 220 }}>
              <InputLabel id="vax-status">Status</InputLabel>
              <Select labelId="vax-status" label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
                {statusOptions.map((opt) => (
                  <MenuItem key={opt.key} value={opt.key}>{opt.label}</MenuItem>
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

        <Row label="Note">
          <TextField fullWidth multiline minRows={3} placeholder="Add your note" value={note} onChange={(e) => setNote(e.target.value)} />
        </Row>

        <Row label="Description">
          <Typography sx={{ whiteSpace: "pre-wrap" }}>{data.vaccine?.description || "-"}</Typography>
        </Row>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, py: 1.75, borderTop: "1px solid #E5E7EB" }}>
        <Button onClick={onClose} variant="text" sx={{ fontWeight: 700, color: "#374151" }}>CANCEL</Button>
        <Button onClick={() => onSave({ status, date, note })} variant="contained" sx={{ bgcolor: "#22C55E", fontWeight: 800, px: 3, "&:hover": { bgcolor: "#16A34A" } }}>
          SAVE
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function VaccinationSchedulePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { childId: childIdParam } = useParams();

  const children = useSelector((s) => s.children?.list || []);
  const vaccinesByChildId = useSelector((s) => s.vaccination?.vaccinesByChildId || {});
  const loading = useSelector((s) => s.vaccination?.loading || s.children?.loading);

  const [selected, setSelected] = useState(null);

  // Load children nếu state đang trống
  useEffect(() => {
    if (!children?.length) dispatch(loadChildren());
  }, [children?.length, dispatch]);

  // Khi có children -> load vaccines (1 bé nếu có childIdParam, ngược lại tất cả)
  useEffect(() => {
    if (!children?.length) return;
    const id = childIdParam ? Number(childIdParam) : null;
    if (id) {
      const child = children.find((c) => Number(c.id) === id);
      if (child) dispatch(loadVaccinesForAllChildren([child]));
    } else {
      dispatch(loadVaccinesForAllChildren(children));
    }
  }, [children, childIdParam, dispatch]);

  const openUpdate = (child, row) => {
    setSelected({
      childId: child.id,
      childName: `${child.firstName || ""} ${child.lastName || ""}`.trim() || "Child",
      vaccineId: row.vaccine?.id,
      vaccine: row.vaccine,
      status: row.status || "NOT_YET",
      updateTime: row.updateTime,
      note: row.note,
    });
  };

  const handleSave = ({ status, date, note }) => {
    if (!selected) return;
    dispatch(
      saveVaccineStatus({
        childId: selected.childId,
        vaccineId: selected.vaccineId,
        payload: { status, updateTime: date || null, note },
      })
    );
    setSelected(null);
  };

  // Tên tiêu đề tuỳ theo ngữ cảnh
  const title =
    childIdParam
      ? `Vaccination schedule — Child #${childIdParam}`
      : "Vaccination schedule (All children)";

  // Nếu có childIdParam thì chỉ render đúng bé đó
  const childrenToRender = childIdParam
    ? children.filter((c) => String(c.id) === String(childIdParam))
    : children;

  return (
    <div className="py-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              width: 40, height: 40, borderRadius: "999px", background: "#FFF",
              boxShadow: "0 2px 6px rgba(0,0,0,.08)", "&:hover": { background: "#FFF" },
            }}
          >
            <ArrowBackIosNewRoundedIcon fontSize="small" />
          </IconButton>
          <div className="w-10 h-10 rounded-full bg-[#FFE7F7] flex items-center justify-center shadow-sm">
            <VaccinesRoundedIcon />
          </div>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#374151" }}>
            {title}
          </Typography>
        </div>
        <Button
          onClick={() => navigate("/home/health/vaccination/summary")}
          sx={{
            bgcolor: "#1B9C9E", color: "#FFFBEF", fontWeight: 700, textTransform: "none",
            fontSize: "0.9rem", borderRadius: "999px", px: 2.5, py: 0.7,
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)", transition: "all 0.2s ease",
            "&:hover": { bgcolor: "#138C8E", boxShadow: "0 3px 8px rgba(0,0,0,0.12)" },
          }}
        >
          Summary
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <CircularProgress />
        </div>
      ) : null}

      {/* Mỗi bé một card */}
      {childrenToRender.map((child) => {
        const rows = vaccinesByChildId[child.id] || [];
        return (
          <Card
            key={child.id}
            elevation={0}
            sx={{
              borderRadius: 4, overflow: "hidden", border: "1px solid #E5E7EB",
              boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
            }}
          >
            <CardContent sx={{ p: 0 }}>
              {/* Header child */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#F8FAFC] border-b border-[#E5E7EB]">
                <Typography sx={{ fontWeight: 800, color: "#0F172A" }}>
                  {(child.firstName || "") + " " + (child.lastName || "")}
                </Typography>
                <Typography variant="body2" sx={{ color: "#334155" }}>
                  DOB: {child.dob ? new Date(child.dob).toLocaleDateString() : "-"}
                </Typography>
              </div>

              {/* Header row */}
              <div className="grid grid-cols-3 bg-[#38BDF8] text-white font-semibold text-center py-3">
                <div>Vaccine</div>
                <div>Description</div>
                <div>Status</div>
              </div>

              {/* Body */}
              {rows.length === 0 ? (
                <div className="p-4 text-center text-slate-500">No vaccines found</div>
              ) : (
                rows.map((r, idx) => {
                  const meta = STATUS_META[r.status || "NONE"];
                  return (
                    <div
                      key={`${child.id}-${r.vaccine?.id}-${idx}`}
                      className={`grid grid-cols-3 text-sm ${
                        idx % 2 === 0 ? "bg-[#F0F9FF]" : "bg-white"
                      } border-t border-[#E5E7EB]`}
                    >
                      <div className="p-4 text-center font-medium text-slate-700 border-r border-[#E5E7EB]">
                        {r.vaccine?.name}
                        <div className="text-xs text-slate-500">{r.vaccine?.diseaseName}</div>
                      </div>

                      <div className="p-4 text-slate-700 whitespace-pre-wrap border-r border-[#E5E7EB]">
                        {r.vaccine?.description || "-"}
                      </div>

                      <div className="p-4 flex items-center justify-center">
                        <Button
                          variant="contained"
                          onClick={() => openUpdate(child, r)}
                          sx={{
                            bgcolor: meta.color,
                            color: meta.text,
                            textTransform: "none",
                            fontWeight: 700,
                            "&:hover": { filter: "brightness(0.95)" },
                          }}
                          startIcon={
                            r.status && r.status !== "NONE" ? (
                              <CircleIcon sx={{ fontSize: 10, color: meta.text }} />
                            ) : null
                          }
                        >
                          {meta.label}
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        );
      })}

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

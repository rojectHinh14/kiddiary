import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import BabyChangingStationRoundedIcon from "@mui/icons-material/BabyChangingStationRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { useNavigate, useParams, useLocation, useSearchParams } from "react-router-dom";
import instance from "../../axios";

/**
 * VaccinationSummaryPage.jsx (JS)
 * - Đọc childId từ: URL param → query → navigation state → fallback (1)
 * - Gọi API: GET /api/children/:childId/vaccines (sử dụng API_BASE)
 * - Gom nhóm theo diseaseName và một số rule (5-in-1/6-in-1, v.v.)
 * - Đã tiêm: ✓ xanh; Skipped: ✕ cam; Pending: số thứ tự
 */

const API_BASE = "http://localhost:8080"; // đổi theo môi trường của bạn

function pillStyle(color, bg) {
  return {
    width: 28,
    height: 28,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    bgcolor: bg,
    border: `2px solid ${color}`,
    color,
    fontWeight: 800,
  };
}

function Dose({ index, status }) {
  if (status === "injected") {
    return (
      <Tooltip title={`Dose ${index + 1}: Injected`}>
        <Box sx={pillStyle("#07A66B", "#E8F8EF")}>
          <CheckRoundedIcon sx={{ fontSize: 18 }} />
        </Box>
      </Tooltip>
    );
  }
  if (status === "skipped") {
    return (
      <Tooltip title={`Dose ${index + 1}: Skipped`}>
        <Box sx={pillStyle("#EF6C00", "#FFF3E0")}>
          <CloseRoundedIcon sx={{ fontSize: 18 }} />
        </Box>
      </Tooltip>
    );
  }
  if (status === "scheduled") {
    return (
      <Tooltip title={`Dose ${index + 1}: Scheduled`}>
        <Box sx={pillStyle("#0284C7", "#F0F9FF")}>
          <RemoveRoundedIcon sx={{ fontSize: 18 }} />
        </Box>
      </Tooltip>
    );
  }
  return (
    <Tooltip title={`Dose ${index + 1}: Pending`}>
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#FFFBEF",
          border: "2px solid #1B9C9E",
          color: "#1B9C9E",
          fontWeight: 700,
          fontSize: 13,
        }}
      >
        {index + 1}
      </Box>
    </Tooltip>
  );
}

const norm = (s = "") => s.toLowerCase().replace(/\s+/g, " ").trim();
function mapToSummaryCategory(vac) {
  const name = norm(vac.vaccineName || "");
  const disease = norm(vac.diseaseName || "");
  const type = norm(vac.vaccinationType || "");

  // 5-in-1 / 6-in-1
  if (name.includes("6-in-1") || name.includes("5-in-1") || type.includes("6-in-1") || type.includes("5-in-1")) {
    return "5-in-1 or 6-in-1";
  }

  if (disease.includes("hepatitis b")) return "Hepatitis B (HBV)";
  if (disease.includes("tuberculosis")) return "Tuberculosis (BCG)";
  if (disease.includes("rotavirus")) return "Rotavirus";
  if (disease.includes("pneumococcal")) return "Pneumococcal";
  if (disease.includes("influenza") || name.includes("seasonal flu")) return "Seasonal Flu";
  if (disease.includes("meningococcal") && (name.includes(" bc") || name.endsWith("bc"))) return "Meningococcal BC";
  if (disease.includes("measles") || disease.includes("mumps") || disease.includes("rubella")) return "Measles - Mumps - Rubella (MMR)";
  if (disease.includes("japanese encephalitis")) return "Japanese Encephalitis B";
  if (disease.includes("varicella") || disease.includes("chickenpox")) return "Varicella / Chickenpox";
  if (disease.includes("hepatitis a")) return "Hepatitis A";
  if (disease.includes("typhoid")) return "Typhoid";
  if (disease.includes("meningococcal") && (name.includes(" ac") || name.endsWith("ac"))) return "Meningococcal AC";

  return vac.vaccineName || vac.diseaseName || "Unknown"; // fallback để debug
}

export default function VaccinationSummaryPage({ babyName = "" }) {
  const navigate = useNavigate();
  const { childId: paramId } = useParams();
  const { state } = useLocation();
  const [sp] = useSearchParams();

  // Ưu tiên: param → query → state → fallback
  const childId = paramId || sp.get("childId") || (state && state.childId) || 1;

  const vaccinesCatalog = useMemo(
    () => [
      { name: "Hepatitis B (HBV)", doses: 5 },
      { name: "Tuberculosis (BCG)", doses: 1 },
      { name: "Rotavirus", doses: 3 },
      { name: "5-in-1 or 6-in-1", doses: 4 },
      { name: "Pneumococcal", doses: 4 },
      { name: "Seasonal Flu", doses: 2 },
      { name: "Meningococcal BC", doses: 2 },
      { name: "Measles - Mumps - Rubella (MMR)", doses: 2 },
      { name: "Japanese Encephalitis B", doses: 3 },
      { name: "Varicella / Chickenpox", doses: 2 },
      { name: "Hepatitis A", doses: 2 },
      { name: "Meningococcal AC", doses: 1 },
      { name: "Typhoid", doses: 1 },
      { name: "Cervical cancer, Human Papillomavirus (HPV)", doses: 1 },
    ],
    []
  );

  const [doseMap, setDoseMap] = useState({});

  useEffect(() => {
    async function load() {
      try {
       const { data: json } = await instance.get(`/api/children/${childId}/vaccines`);
        const items = json?.data || [];

        const tmp = {};
        for (const it of items) {
          const status = it?.status || it?.statusData?.keyMap || (it?.statusData?.valueEn || "").toLowerCase() || "unknown";
          const vac = it?.Vaccine || {};
          const key = mapToSummaryCategory(vac);
          if (!tmp[key]) tmp[key] = [];
          tmp[key].push({ status, time: it?.updateTime || "" });
        }

        const normalized = {};
        for (const v of vaccinesCatalog) {
          const slots = new Array(v.doses).fill("pending");
          const fromApi = (tmp[v.name] || []).sort((a, b) => String(a.time).localeCompare(String(b.time)));
          fromApi.slice(0, v.doses).forEach((rec, i) => (slots[i] = rec.status));
          normalized[v.name] = slots;
        }
        setDoseMap(normalized);

        // debug key chưa map
        Object.keys(tmp).forEach((k) => {
          if (!vaccinesCatalog.find((v) => v.name === k)) {
            console.warn("[Summary] Unmapped category:", k, tmp[k]);
          }
        });
      } catch (e) {
        console.error("Failed to fetch vaccines", e);
      }
    }
    load();
  }, [childId, vaccinesCatalog]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ width: 40, height: 40, borderRadius: "999px", background: "#FFF", boxShadow: "0 2px 6px rgba(0,0,0,.08)", "&:hover": { background: "#FFF" } }}>
            <ArrowBackIosNewRoundedIcon fontSize="small" />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "#374151" }}>
            Vaccination Summary — Child #{String(childId)}
          </Typography>
        </Box>

        <Chip
          label={
            <div className="flex items-center gap-2">
              <span className="font-semibold">{babyName || ""}</span>
              <BabyChangingStationRoundedIcon className="text-rose-400" />
            </div>
          }
          sx={{ bgcolor: "#BFEDE1", color: "#066C61", borderRadius: "18px", height: 40, px: 1.5, fontWeight: 700 }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <Table>
          <TableHead sx={{ background: "#F3F4F6" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, fontSize: 16, color: "#374151", width: "50%" }}>Vaccine</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 16, color: "#374151" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vaccinesCatalog.map((v, i) => (
              <TableRow key={v.name} sx={{ background: i % 2 === 0 ? "#E6F7FF" : "white", "&:hover": { background: "#DCFDF5" } }}>
                <TableCell sx={{ fontWeight: 600, color: "#1E3A8A" }}>{v.name}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {(doseMap[v.name] || new Array(v.doses).fill("pending")).map((status, index) => (
                      <Dose key={index} index={index} status={status} />
                    ))}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Legend */}
      <Box sx={{ display: "flex", gap: 2, mt: 2, alignItems: "center" }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Box sx={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid #07A66B", bgcolor: "#E8F8EF", display: "flex", alignItems: "center", justifyContent: "center", color: "#07A66B" }}>
            <CheckRoundedIcon sx={{ fontSize: 14 }} />
          </Box>
          <Typography variant="body2">Injected</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Box sx={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid #EF6C00", bgcolor: "#FFF3E0", display: "flex", alignItems: "center", justifyContent: "center", color: "#EF6C00" }}>
            <CloseRoundedIcon sx={{ fontSize: 14 }} />
          </Box>
          <Typography variant="body2">Skipped</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Box sx={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid #1B9C9E", bgcolor: "#FFFBEF", display: "flex", alignItems: "center", justifyContent: "center", color: "#1B9C9E", fontSize: 12, fontWeight: 700 }}>1</Box>
          <Typography variant="body2">Pending</Typography>
        </Box>
      </Box>
    </Box>
  );
}

import React from "react";
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
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import BabyChangingStationRoundedIcon from "@mui/icons-material/BabyChangingStationRounded";
import { useNavigate } from "react-router-dom";

export default function VaccinationSummaryPage({ babyName = "Yen Nhi" }) {
  const navigate = useNavigate();

  const vaccines = [
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
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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

          <Typography variant="h5" sx={{ fontWeight: 800, color: "#374151" }}>
            Vaccination Summary
          </Typography>
        </Box>

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
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Table>
          <TableHead sx={{ background: "#F3F4F6" }}>
            <TableRow>
              <TableCell
                sx={{ fontWeight: 700, fontSize: 16, color: "#374151", width: "50%" }}
              >
                Vaccine
              </TableCell>
              <TableCell
                sx={{ fontWeight: 700, fontSize: 16, color: "#374151" }}
              >
                Status
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {vaccines.map((v, i) => (
              <TableRow
                key={i}
                sx={{
                  background: i % 2 === 0 ? "#E6F7FF" : "white",
                  "&:hover": { background: "#DCFDF5" },
                }}
              >
                <TableCell sx={{ fontWeight: 600, color: "#1E3A8A" }}>
                  {v.name}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {Array.from({ length: v.doses }).map((_, index) => (
                      <Box
                        key={index}
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
                    ))}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

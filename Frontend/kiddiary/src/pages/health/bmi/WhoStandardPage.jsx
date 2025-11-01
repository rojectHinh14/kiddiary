import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  IconButton,
  Box,
  Paper,
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import { useNavigate } from "react-router-dom";

export default function WhoStandardPage() {
  const navigate = useNavigate();

  const boyData = [
    { age: "Newborn", weight: "2.5 – 4.3", height: "46.1 – 53.7" },
    { age: "1 month", weight: "3.4 – 5.8", height: "54.7 – 58.6" },
    { age: "3 months", weight: "4.9 – 7.2", height: "59.7 – 63.9" },
    { age: "6 months", weight: "6.4 – 9.3", height: "65.7 – 71.9" },
    { age: "9 months", weight: "7.4 – 10.4", height: "69.2 – 76.0" },
    { age: "1 year", weight: "8.9 – 11.8", height: "74.0 – 81.0" },
    { age: "2 years", weight: "10.8 – 13.9", height: "84.1 – 95.0" },
    { age: "3 years", weight: "11.8 – 15.1", height: "91.9 – 102.3" },
    { age: "4 years", weight: "13.0 – 17.0", height: "99.0 – 110.3" },
    { age: "5 years", weight: "14.3 – 18.3", height: "105.3 – 117.2" },
  ];

  const girlData = [
    { age: "Newborn", weight: "2.4 – 4.2", height: "45.4 – 52.9" },
    { age: "1 month", weight: "3.2 – 5.1", height: "49.8 – 57.6" },
    { age: "3 months", weight: "4.5 – 6.4", height: "55.8 – 63.9" },
    { age: "6 months", weight: "5.8 – 8.2", height: "61.5 – 70.3" },
    { age: "9 months", weight: "6.7 – 9.0", height: "66.0 – 73.5" },
    { age: "1 year", weight: "7.9 – 10.2", height: "71.5 – 79.2" },
    { age: "2 years", weight: "9.8 – 12.8", height: "81.7 – 92.9" },
    { age: "3 years", weight: "11.0 – 14.8", height: "89.4 – 99.7" },
    { age: "4 years", weight: "12.3 – 16.7", height: "96.8 – 107.9" },
    { age: "5 years", weight: "13.7 – 18.2", height: "103.3 – 115.2" },
  ];

  return (
    <Box className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
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
          WHO Growth Standards – Weight & Height
        </Typography>
      </div>

      {/* Boys Table */}
      <Paper elevation={3} sx={{ mb: 6, borderRadius: 4, overflow: "hidden" }}>
        <Box sx={{ background: "#BFEDE1", p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#066C61" }}>
            👦 Boys Growth Reference
          </Typography>
        </Box>
        <Table>
          <TableHead sx={{ background: "#E7F7F3" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Age</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Weight (kg)</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Height (cm)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {boyData.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:nth-of-type(odd)": { background: "#F9FFFD" },
                  "&:hover": { background: "#E5F9F4" },
                }}
              >
                <TableCell>{row.age}</TableCell>
                <TableCell>{row.weight}</TableCell>
                <TableCell>{row.height}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Girls Table */}
      <Paper elevation={3} sx={{ borderRadius: 4, overflow: "hidden" }}>
        <Box sx={{ background: "#FCD8D4", p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#8B2D2D" }}>
            👧 Girls Growth Reference
          </Typography>
        </Box>
        <Table>
          <TableHead sx={{ background: "#FFF1F0" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Age</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Weight (kg)</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Height (cm)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {girlData.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:nth-of-type(odd)": { background: "#FFF9F9" },
                  "&:hover": { background: "#FFE5E3" },
                }}
              >
                <TableCell>{row.age}</TableCell>
                <TableCell>{row.weight}</TableCell>
                <TableCell>{row.height}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

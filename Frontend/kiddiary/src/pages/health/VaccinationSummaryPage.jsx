// src/pages/VaccinationSummaryPage.jsx
import React, { useEffect, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import BabyChangingStationRoundedIcon from "@mui/icons-material/BabyChangingStationRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import {
  useNavigate,
  useParams,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../axios";

const DosePill = ({ status, doseNumber }) => {
  if (status === "injected") {
    return (
      <Tooltip title={`Dose ${doseNumber}: Injected`}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            bgcolor: "#10B981",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CheckRoundedIcon sx={{ fontSize: 20 }} />
        </Box>
      </Tooltip>
    );
  }

  if (status === "skipped") {
    return (
      <Tooltip title={`Dose ${doseNumber}: Skipped`}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            bgcolor: "#F97316",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 20 }} />
        </Box>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={`Dose ${doseNumber}: Not injected yet`}>
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "3px solid #1E90FF",
          bgcolor: "#EFF6FF",
          color: "#1E40AF",
          fontWeight: 800,
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {doseNumber}
      </Box>
    </Tooltip>
  );
};

export default function VaccinationSummaryPage() {
  const navigate = useNavigate();
  const { childId: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const childId =
    paramId || searchParams.get("childId") || location.state?.childId || 1;

  const children = useSelector((state) => state.children?.list || []);
  const currentChild = children.find((c) => c.id === Number(childId));

  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/vaccines/child/${childId}`);
        if (response.data.errCode === 0) {
          // Sắp xếp các mũi theo doseNumber tăng dần
          const sortedData = response.data.data.map((group) => ({
            ...group,
            doses: group.doses.sort((a, b) => a.doseNumber - b.doseNumber),
          }));
          setSummaryData(sortedData);
        }
      } catch (err) {
        console.error("Failed to load vaccination summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [childId]);

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", p: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              bgcolor: "white",
              boxShadow: 3,
              "&:hover": { bgcolor: "#f9fafb" },
            }}
          >
            <ArrowBackIosNewRoundedIcon />
          </IconButton>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#111827" }}>
              Vaccination Summary
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Complete overview of all vaccine doses
            </Typography>
          </Box>
        </Box>

        {currentChild && (
          <Chip
            icon={<BabyChangingStationRoundedIcon sx={{ color: "#EC4899" }} />}
            label={
              <Typography fontWeight={700}>
                {currentChild.firstName} {currentChild.lastName}
              </Typography>
            }
            sx={{
              bgcolor: "#FCE7F3",
              color: "#9D174D",
              fontSize: "1rem",
              height: 48,
              px: 2,
              borderRadius: 8,
            }}
          />
        )}
      </Box>

      {/* Loading */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress size={60} thickness={5} />
        </Box>
      ) : (
        <>
          {/* Summary Table */}
          <TableContainer
            component={Paper}
            elevation={6}
            sx={{ borderRadius: 3, overflow: "hidden" }}
          >
            <Table>
              <TableHead sx={{ bgcolor: "#009999" }}>
                <TableRow>
                  <TableCell
                    sx={{ color: "white", fontWeight: 700, fontSize: "1.1rem" }}
                  >
                    Vaccine
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "white", fontWeight: 700, fontSize: "1.1rem" }}
                  >
                    Doses Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summaryData.map((group, index) => (
                  <TableRow
                    key={group.vaccinationType}
                    sx={{
                      backgroundColor: index % 2 === 0 ? "#F8FAFC" : "white",
                      "&:hover": { backgroundColor: "#EFF6FF" },
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "#1E293B",
                      }}
                    >
                      <div>{group.vaccinationType}</div>
                      {group.doses.length > 1 && (
                        <Typography variant="caption" color="text.secondary">
                          {group.doses.length} doses required
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          justifyContent: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        {group.doses.map((dose) => (
                          <DosePill
                            key={dose.id}
                            status={dose.status}
                            doseNumber={dose.doseNumber}
                          />
                        ))}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Legend */}
          <Box
            sx={{
              mt: 4,
              display: "flex",
              gap: 4,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  bgcolor: "#10B981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckRoundedIcon sx={{ color: "white", fontSize: 18 }} />
              </Box>
              <Typography fontWeight={600}>Injected</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  bgcolor: "#F97316",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CloseRoundedIcon sx={{ color: "white", fontSize: 18 }} />
              </Box>
              <Typography fontWeight={600}>Skipped</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  border: "3px solid #1E90FF",
                  bgcolor: "#EFF6FF",
                  color: "#1E40AF",
                  fontWeight: 800,
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                1
              </Box>
              <Typography fontWeight={600}>Pending</Typography>
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 6, textAlign: "center", color: "text.secondary" }}>
            <Typography variant="body2">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}

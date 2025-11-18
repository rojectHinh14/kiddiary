// src/pages/health/milk/MilkOverviewPage.jsx
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ChildCareRoundedIcon from "@mui/icons-material/ChildCareRounded";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";

import { loadChildMilkLogs } from "../../../store/slice/childMilkSlice";
import { getChildrenByUser } from "../../../services/childService"; 
export default function MilkOverviewPage() {
  const { totalToday, logs, last7Days, date, loading, error } = useSelector(
    (state) => state.childMilk
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { childId } = useParams(); // lấy id từ URL

  const [babyName, setBabyName] = useState(""); // tên bé

  const ONE_LITER_ML = 1000;

  const weeklyChartData = (last7Days || [])
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((d) => ({
      label: new Date(d.date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      totalMl: d.totalMl || 0,
    }));

  const maxWeeklyMl = weeklyChartData.length
    ? Math.max(ONE_LITER_ML, ...weeklyChartData.map((d) => d.totalMl || 0))
    : ONE_LITER_ML;

  const yMaxDomain = maxWeeklyMl + 200;

  // 🔹 Load tên bé theo childId, dùng đúng getChildrenByUser phía backend
  useEffect(() => {
    const fetchChildName = async () => {
      if (!childId) return;

      try {
        const children = await getChildrenByUser(); // <-- trả thẳng array children

        const found = children.find(
          (c) => String(c.id) === String(childId)
        );

        if (found) {
          setBabyName(`${found.firstName} ${found.lastName}`.trim());
        } else {
          setBabyName("Unknown child");
        }
      } catch (err) {
        console.error("Error fetching children:", err);
        setBabyName("Unknown child");
      }
    };

    fetchChildName();
  }, [childId]);

  // load milk logs cho hôm nay khi vào trang / đổi childId
  useEffect(() => {
    if (!childId) return;
    const today = new Date().toISOString().slice(0, 10);
    dispatch(loadChildMilkLogs({ childId, date: today }));
  }, [childId, dispatch]);

  const todayTotalMl = totalToday || 0;
  const todayList = logs || [];

  return (
    <div className="py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-3">
        <div className="flex items-center gap-3">
          {/* Back luôn quay về đúng trang milk của bé đó */}
          <IconButton
            onClick={() => navigate("/home/health")}
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
            Feeding Overview for
          </Typography>

          <Chip
            label={
              <div className="flex items-center gap-2">
                <span className="font-semibold">
                  {babyName || "Loading..."}
                </span>
                <ChildCareRoundedIcon className="text-rose-400" />
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
        </div>

        <Button
          startIcon={<AddRoundedIcon />}
          onClick={() => navigate(`/home/health/milk/${childId}/new`)}
          sx={{
            bgcolor: "#FFEECF",
            color: "#5B4B22",
            fontWeight: 600,
            borderRadius: "12px",
            textTransform: "none",
            px: 2,
            py: 1,
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            "&:hover": { bgcolor: "#FFE3A3" },
          }}
        >
          Add Feeding
        </Button>
      </div>

      {/* Loading / error */}
      {loading && (
        <Typography sx={{ mb: 2, color: "#6B7280" }}>
          Đang tải dữ liệu...
        </Typography>
      )}
      {error && (
        <Typography sx={{ mb: 2, color: "red" }}>
          {error === "Network Error" ? "Không kết nối được server" : error}
        </Typography>
      )}

      {/* Today card */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          background: "#FFF8EE",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <CardContent>
          <Typography sx={{ fontWeight: 700, color: "#374151", mb: 1 }}>
            Today{" "}
            {date && (
              <span className="text-sm text-gray-500">
                ({new Date(date).toLocaleDateString()})
              </span>
            )}
          </Typography>

          <div className="rounded-2xl bg-[#FFF1D5] p-4">
            <Typography sx={{ color: "#0F766E", fontWeight: 700 }}>
              Total Milk Today:
            </Typography>
            <Typography
              sx={{
                fontSize: 48,
                fontWeight: 800,
                color: "#16837B",
                lineHeight: 1,
              }}
            >
              {todayTotalMl}{" "}
              <span className="text-2xl align-middle">ml</span>
            </Typography>

            <div className="mt-3 space-y-2">
              {todayList.map((i) => (
                <div
                  key={i.id}
                  className="flex items-center justify-between rounded-full bg-[#CFE6FF] px-3 py-2 text-[#0b4a82]"
                >
                  <span className="font-semibold">
                    {new Date(i.feedingAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="opacity-70">{i.sourceCode}</span>
                  <span className="font-semibold">{i.amountMl} ml</span>
                </div>
              ))}

              {!loading && todayList.length === 0 && !error && (
                <div className="text-sm text-gray-500 mt-1">
                  Chưa có lần bú nào được ghi lại hôm nay.
                </div>
              )}

              <div
                className="text-right text-sm italic text-[#A855F7] cursor-pointer mt-2"
                onClick={() =>
                  navigate(`/home/health/milk/${childId}/history`)
                }
              >
                see feeding history &gt;&gt;
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last 7 days */}
      <Card
        elevation={0}
        sx={{
          mt: 4,
          borderRadius: 4,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        <CardContent>
          <Typography sx={{ fontWeight: 700, color: "#374151", mb: 2 }}>
            Last 7 days
          </Typography>

          {weeklyChartData && weeklyChartData.length > 0 ? (
            <Box
              sx={{
                height: 260,
                bgcolor: "#F9FAFB",
                borderRadius: 2,
                px: 2,
                py: 1,
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `${v} ml`}
                    domain={[0, yMaxDomain]}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} ml`, "Total"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <ReferenceLine
                    y={ONE_LITER_ML}
                    stroke="#F97316"
                    strokeDasharray="4 4"
                  />
                  <Bar dataKey="totalMl" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          ) : (
            <Box
              sx={{
                height: 220,
                borderRadius: 2,
                bgcolor: "#F9FAFB",
                border: "1px dashed #e5e7eb",
              }}
              className="flex items-center justify-center text-gray-500"
            >
              (No data to display)
            </Box>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

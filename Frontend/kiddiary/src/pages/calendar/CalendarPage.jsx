import { useMemo, useState, useEffect } from "react";
import {
  addMonths,
  addYears,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isToday,
  parseISO,
} from "date-fns";
import vi from "date-fns/locale/vi";
import NewPostDialog from "../../components/home/NewPostDialog";
import { buildMonthMatrix } from "../../utils/buildMonthMatrix";
import CalendarHeader from "../../components/calendar/CalendarHeader";
import MonthGrid from "../../components/calendar/MonthGrid";
import RightSidebar from "../../components/calendar/RightSidebar";
import {
  getAllMediaByUserService,
  uploadMediaService,
} from "../../services/mediaService";

export default function CalendarPage() {
  const [current, setCurrent] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const response = await getAllMediaByUserService();
        if (response.data && response.data.errCode === 0) {
          const mappedMoments = response.data.data.map((media) => ({
            id: media.id.toString(),
            date: format(new Date(media.date), "yyyy-MM-dd"),
            caption: media.description || "",
            images: [`data:image/jpeg;base64,${media.fileUrl}`],
            childId: "c1",
          }));
          setMoments(mappedMoments);
        }
      } catch (error) {
        console.error("Error fetching media:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  // Nhóm theo yyyy-MM-dd
  const grouped = useMemo(() => {
    const m = {};
    for (const it of moments) {
      const key = it.date;
      (m[key] ||= []).push(it);
    }
    return m;
  }, [moments]);

  const monthMatrix = useMemo(() => buildMonthMatrix(current), [current]);

  const openNewMoment = (date) => {
    setSelectedDate(date);
    setOpenDialog(true);
  };

  const handleCreate = async ({ files, caption, date: inputDate, people }) => {
    if (files.length === 0) return; // Không upload nếu không có file

    try {
      // Convert file đầu tiên thành base64
      const file = files[0];
      const base64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          // Loại bỏ prefix 'data:image/...;base64,' để gửi chỉ base64 string
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        };
      });

      const response = await uploadMediaService({
        fileBase64: base64,
        description: caption,
        date: format(inputDate || selectedDate || new Date(), "yyyy-MM-dd"),
      });

      if (response.data && response.data.errCode === 0) {
        const fetchResponse = await getAllMediaByUserService();
        if (fetchResponse.data && fetchResponse.data.errCode === 0) {
          const mappedMoments = fetchResponse.data.data.map((media) => ({
            id: media.id.toString(),
            date: format(new Date(media.date), "yyyy-MM-dd"),
            caption: media.description || "",
            images: [`data:image/jpeg;base64,${media.fileUrl}`],
            childId: "c1",
          }));
          setMoments(mappedMoments);
        }
        setOpenDialog(false);
      } else {
        alert("Upload failed: " + (response.data?.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error creating moment:", error);
      alert("Upload error: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF9F0] flex items-center justify-center">
        Loading moments...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      {/* Header - giữ nguyên */}
      <div className="sticky top-0 z-10 bg-[#FFF9F0] border-b border-black/5">
        <CalendarHeader
          current={current}
          onPrevYear={() => setCurrent((d) => addYears(d, -1))}
          onNextYear={() => setCurrent((d) => addYears(d, 1))}
          onSetMonth={(idx) =>
            setCurrent((d) => new Date(d.getFullYear(), idx, 1))
          }
          onToday={() => setCurrent(new Date())}
        />
      </div>

      {/* Body - giữ nguyên, nhưng giờ grouped dùng data thật */}
      <div className="max-w-[1280px] mx-auto grid grid-cols-12 gap-6 px-6 py-6">
        <div className="col-span-12 lg:col-span-9">
          <MonthGrid
            current={current}
            matrix={monthMatrix}
            grouped={grouped}
            selectedDate={selectedDate}
            onSelect={(d) => setSelectedDate(d)}
            onAddMoment={openNewMoment}
          />
        </div>

        <div className="col-span-12 lg:col-span-3">
          <RightSidebar
            onAdd={() => openNewMoment(selectedDate || new Date())}
          />
        </div>
      </div>

      {/* Dialog - truyền onSubmit mới */}
      <NewPostDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleCreate}
        defaultDate={selectedDate || new Date()}
      />
    </div>
  );
}

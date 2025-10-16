import { useMemo, useState } from "react";
import {
  addMonths, addYears, format, isSameDay, isSameMonth, startOfMonth,
  endOfMonth, startOfWeek, endOfWeek, addDays, isToday, parseISO
} from "date-fns";
import vi from "date-fns/locale/vi";
import NewPostDialog from "../../components/home/NewPostDialog";
import { buildMonthMatrix } from "../../utils/buildMonthMatrix";
import CalendarHeader from "../../components/calendar/CalendarHeader";
import MonthGrid from "../../components/calendar/MonthGrid";
import RightSidebar from "../../components/calendar/RightSidebar";

export default function CalendarPage() {
  const [current, setCurrent] = useState(new Date());           // tháng đang xem
  const [selectedDate, setSelectedDate] = useState(null);       // ngày chọn
  const [openDialog, setOpenDialog] = useState(false);

  // demo data: moments có ảnh gắn vào ngày
  const [moments, setMoments] = useState([
    { id: "m1", date: "2025-10-16", caption: "Check-up", images: ["https://i.pravatar.cc/140?u=1"], childId: "c1" },
    { id: "m2", date: "2025-10-16", caption: "Vaccine", images: ["https://i.pravatar.cc/140?u=2"], childId: "c1" },
    { id: "m3", date: "2025-10-05", caption: "Picnic", images: ["https://i.pravatar.cc/140?u=3"], childId: "c2" },
  ]);

  // nhóm theo yyyy-MM-dd
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

  const handleCreate = ({ files, caption, date, people }) => {
    const urls = files.slice(0, 3).map((f) => URL.createObjectURL(f));
    const iso = format(date || selectedDate || new Date(), "yyyy-MM-dd");
    setMoments((prev) => [
      { id: crypto.randomUUID(), date: iso, caption: caption || "", images: urls, childId: "c1" },
      ...prev,
    ]);
    setOpenDialog(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#FFF9F0] border-b border-black/5">
        <CalendarHeader
          current={current}
          onPrevYear={() => setCurrent((d) => addYears(d, -1))}
          onNextYear={() => setCurrent((d) => addYears(d, 1))}
          onSetMonth={(idx) => setCurrent((d) => new Date(d.getFullYear(), idx, 1))}
          onToday={() => setCurrent(new Date())}
        />
      </div>

      {/* Body */}
      <div className="max-w-[1280px] mx-auto grid grid-cols-12 gap-6 px-6 py-6">
        {/* Grid */}
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

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-3">
          <RightSidebar onAdd={() => openNewMoment(selectedDate || new Date())} />
        </div>
      </div>

      {/* Dialog tạo moment */}
      <NewPostDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSubmit={handleCreate}
        defaultDate={selectedDate || new Date()}
      />
    </div>
  );
}
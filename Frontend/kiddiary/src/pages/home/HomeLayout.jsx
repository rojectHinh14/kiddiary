// HomeLayout.jsx
import { useSearchParams, Outlet } from "react-router-dom";
import HeaderHome from "../../components/home/HeaderHome";

export default function HomeLayout() {
  const [sp, setSp] = useSearchParams();
  const tab = sp.get("tab") || "moment";

  const go = (t) => setSp({ tab: t }); // chỉ đổi query, không reload

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col">
      <HeaderHome />
      <div className="flex">
        <aside className="w-56 shrink-0 h-[100vh] bg-[#FFF6EA] p-6 space-y-3">
          <button className={`px-4 py-2 rounded-full text-sm ${tab==='moment' ? 'bg-[#2CC1AE] text-white' : 'hover:bg-black/5'}`} onClick={()=>go('moment')}>Moment</button>
          <button className={`px-4 py-2 rounded-full text-sm ${tab==='calendar' ? 'bg-[#2CC1AE] text-white' : 'hover:bg-black/5'}`} onClick={()=>go('calendar')}>Calendar</button>
          <button className={`px-4 py-2 rounded-full text-sm ${tab==='album' ? 'bg-[#2CC1AE] text-white' : 'hover:bg-black/5'}`} onClick={()=>go('album')}>Album</button>
          <button className="px-4 py-2 rounded-full text-sm hover:bg-black/5">Family & Friend</button>
          <button className="px-4 py-2 rounded-full text-sm hover:bg-black/5">Children</button>
        </aside>

        {/* Vùng nội dung thay đổi theo tab */}
        <main className="flex-1 px-8 pb-16 pt-8">
          <Outlet context={{ tab }} />
        </main>
      </div>
    </div>
  );
}

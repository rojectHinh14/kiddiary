
export default function RightSidebar({ onAdd }) {
  return (
    <aside className="sticky top-16 space-y-4">
      <button
        onClick={onAdd}
        className="w-full bg-[#FF6B6B] text-white font-semibold rounded-xl py-3"
      >
        + Add moments
      </button>

      <button className="w-full border rounded-xl py-3 flex items-center justify-center gap-2">
        <span>👪</span> Add family and friends
      </button>

      <div className="rounded-xl border bg-white overflow-hidden">
        <img className="w-full h-40 object-cover" src="https://i.pravatar.cc/400?img=15" />
        <div className="text-center py-2 font-medium">children1</div>
      </div>

      <button className="w-full text-[#ff4b4b] font-medium underline underline-offset-4">
        photo albums
      </button>
    </aside>
  );
}

export default function HeaderHome() {
  return (
    <header className="w-full flex items-center justify-between bg-[#FFF6EA] px-8 py-4">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-[#2CC1AE]">KidDiary</h1>

      {/* Thanh tìm kiếm */}
      <div className="flex-1 mx-12">
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-gray-200 rounded-full px-6 py-2 focus:outline-none focus:ring-2 focus:ring-[#2CC1AE]"
        />
      </div>

      {/* Avatar */}
      <div>
        <img
          src="https://i.pravatar.cc/40?img=11"
          alt="user avatar"
          className="w-10 h-10 rounded-full object-cover border"
        />
      </div>
    </header>
  );
}

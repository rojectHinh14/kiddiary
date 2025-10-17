import ProfileMenu from "./ProfileMenu";

export default function HeaderHome({ onOpenProfile, onLogout }) {
  return (
    <header className="w-full flex items-center justify-between bg-[#FFF6EA] px-8 py-4">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-[#2CC1AE]">KidDiary</h1>

      {/* Thanh tìm kiếm */}
     

      {/* Avatar */}
    <div>
      <ProfileMenu onOpenProfile={onOpenProfile} onLogout={onLogout} />
</div>
    </header>
  );
}

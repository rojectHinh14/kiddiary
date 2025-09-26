import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Header({ onLogin, onRegister, simple }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* thanh nền bo tròn đáy + bóng */}
      <div className="mx-0 bg-[#faf4de] rounded-b-2xl shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
        <nav className="mx-auto max-w-7xl h-16 px-4 md:px-6 flex items-center">
          {/* Left: Logo */}
            <div className="flex-1 flex items-center">
  <Link to="/">
    <img
      src="/login/logo.svg"
      alt="Kiddiary Logo"
      className="w-32 h-auto object-contain cursor-pointer"
    />
  </Link>
</div>

          {/* Center: Nav items (desktop) */}
          <ul className="hidden md:flex gap-12 text-[16px] font-medium text-[#3c3c3c]">
            <li><Link to="/" className="hover:text-[#48A6A7]">Home</Link></li>
            <li><Link to="/calendar" className="hover:text-[#48A6A7]">Calender</Link></li>
            <li><Link to="/album" className="hover:text-[#48A6A7]">Album</Link></li>
            <li><Link to="/family" className="hover:text-[#48A6A7]">Family &amp; Friends</Link></li>
            <li><Link to="/children" className="hover:text-[#48A6A7]">Children</Link></li>
          </ul>

          {/* Right: Buttons (desktop) */}
          <div className="flex-1 hidden md:flex items-center justify-end gap-3">
            {simple ? (
              <>
                <Link
                  to="/login"
                  className="w-[102px] h-[35px] rounded-[10px] text-[20px] font-semibold
                             bg-[#48A6A7] text-[#FBF3D5] border border-[#48A6A7]
                             hover:bg-[#FBF3D5] hover:text-[#48A6A7] transition-colors duration-200 flex items-center justify-center"
                >
                  Sign up
                </Link>
                <Link
                  to="/login"
                  className="w-[102px] h-[35px] rounded-[10px] text-[20px] font-semibold
                             bg-transparent text-[#48A6A7] border border-[#48A6A7]
                             hover:bg-[#48A6A7] hover:text-[#FBF3D5] transition-colors duration-200 flex items-center justify-center"
                >
                  Log in
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={onRegister}
                  className="w-[102px] h-[35px] rounded-[10px] text-[20px] font-semibold
                             bg-[#48A6A7] text-[#FBF3D5] border border-[#48A6A7]
                             hover:bg-[#FBF3D5] hover:text-[#48A6A7] transition-colors duration-200"
                >
                  Sign up
                </button>
                <button
                  onClick={onLogin}
                  className="w-[102px] h-[35px] rounded-[10px] text-[20px] font-semibold
                             bg-transparent text-[#48A6A7] border border-[#48A6A7]
                             hover:bg-[#48A6A7] hover:text-[#FBF3D5] transition-colors duration-200"
                >
                  Log in
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden ml-2 text-[#48A6A7]"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
          >
            <FiMenu className="text-2xl" />
          </button>
        </nav>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4">
            <ul className="flex flex-col gap-3 text-[#3c3c3c]">
              <li><Link to="/" className="py-2 border-b border-black/10">Home</Link></li>
              <li><Link to="/calendar" className="py-2 border-b border-black/10">Calender</Link></li>
              <li><Link to="/album" className="py-2 border-b border-black/10">Album</Link></li>
              <li><Link to="/family" className="py-2 border-b border-black/10">Family &amp; Friends</Link></li>
              <li><Link to="/children" className="py-2">Children</Link></li>
            </ul>
            <div className="mt-4 flex gap-3">
              <Link
                to="/signup"
                className="flex-1 h-[40px] rounded-[10px] text-[18px] font-semibold
                           bg-[#48A6A7] text-[#FBF3D5] border border-[#48A6A7]
                           hover:bg-[#FBF3D5] hover:text-[#48A6A7] transition-colors duration-200 flex items-center justify-center"
              >
                Sign up
              </Link>
              <Link
                to="/login"
                className="flex-1 h-[40px] rounded-[10px] text-[18px] font-semibold
                           bg-transparent text-[#48A6A7] border border-[#48A6A7]
                           hover:bg-[#48A6A7] hover:text-[#FBF3D5] transition-colors duration-200 flex items-center justify-center"
              >
                Log in
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

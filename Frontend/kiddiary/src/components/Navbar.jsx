import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Navbar({ onLogin, onRegister, simple }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full flex items-center h-20 px-6 bg-gradient-to-b from-black/60 to-transparent z-50">
      {/* Left (Logo) */}
     <div className="flex-1 flex items-center">
  <Link to="/">
    <img
      src="/login/logo.svg"
      alt="Kiddiary Logo"
      className="w-32 h-auto object-contain cursor-pointer"
    />
  </Link>
</div>
    

      {/* Right (Buttons) */}
      <div className="flex-1 hidden md:flex justify-end">
        {simple ? (
          <>
            <Link
              to="/login"
              className="w-32 h-10 rounded-full mr-3 bg-white/40 hover:bg-white/30 text-white flex items-center justify-center"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="w-32 h-10 rounded-full bg-white/40 hover:bg-white/30 text-white flex items-center justify-center"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
<button
  onClick={onLogin}
  className="w-[102px] h-[35px] rounded-[10px] text-[20px] font-semibold
             bg-[#FBF3D5] text-[#48A6A7] border border-[#48A6A7]
             hover:bg-[#48A6A7] hover:text-[#FBF3D5] transition-colors duration-200"
>
  Log In
</button>

{/* Sign Up: nền #48A6A7, chữ #FBF3D5; hover đảo màu + có viền */}
<button
  onClick={onRegister}
  className=" mx-3 w-[102px] h-[35px] rounded-[10px] text-[20px] font-semibold
             bg-[#FBF3D5] text-[#48A6A7] border border-[#48A6A7]
             hover:bg-[#48A6A7] hover:text-[#FBF3D5] transition-colors duration-200"
>
Sign Up
</button>
          </>
        )}
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <FiMenu
          className="text-white text-2xl cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        />
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="absolute top-20 left-0 w-full flex flex-col items-center bg-white/20 backdrop-blur-lg py-6 space-y-4 transition md:hidden">
          <Link to="/" className="text-white hover:border-b-2 border-white">Home</Link>
          <Link to="/blog" className="text-white hover:border-b-2 border-white">Blog</Link>
          <Link to="/services" className="text-white hover:border-b-2 border-white">Services</Link>
          <Link to="/about" className="text-white hover:border-b-2 border-white">About</Link>
        </div>
      )}
    </nav>
  );
}

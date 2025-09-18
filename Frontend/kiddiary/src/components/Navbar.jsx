import { useState } from "react";
import { FiMenu } from "react-icons/fi";

export default function Navbar({ onLogin, onRegister, activeForm }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full flex justify-between items-center h-20 px-6 bg-gradient-to-b from-black/60 to-transparent z-50">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <img 
          src="/login/logo.svg" 
          alt="Kiddiary Logo" 
          className="w-50 h-50 object-contain"  
        />
      </div>

      {/* Menu */}
      <div
        className={`${
          menuOpen
            ? "absolute top-20 left-0 w-full flex flex-col items-center bg-white/20 backdrop-blur-lg py-6 space-y-4 transition"
            : "hidden md:flex space-x-8"
        }`}
      >
        <a href="#" className="text-white hover:border-b-2 border-white">
          Home
        </a>
        <a href="#" className="text-white hover:border-b-2 border-white">
          Blog
        </a>
        <a href="#" className="text-white hover:border-b-2 border-white">
          Services
        </a>
        <a href="#" className="text-white hover:border-b-2 border-white">
          About
        </a>
      </div>

      {/* Buttons */}
      <div className="hidden md:flex">
        <button
          onClick={onLogin}
          className={`w-32 h-10 rounded-full mr-3 transition ${
            activeForm === "login"
              ? "bg-white/70 text-black"
              : "bg-white/40 hover:bg-white/30 text-white"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={onRegister}
          className={`w-32 h-10 rounded-full transition ${
            activeForm === "register"
              ? "bg-white/70 text-black"
              : "bg-white/40 hover:bg-white/30 text-white"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden">
        <FiMenu
          className="text-white text-2xl cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        />
      </div>
    </nav>
  );
}

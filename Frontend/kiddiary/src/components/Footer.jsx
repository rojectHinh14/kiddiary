import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaXTwitter,
  FaPinterest,
} from "react-icons/fa6";

export default function Footer({ className = "" }) {
  return (
    <footer
      className={`bg-[#FBF3D5] text-[#4C4C4C] font-montAlt
                  rounded-t-2xl shadow-[0_-10px_25px_rgba(0,0,0,0.12)]
                  px-6 md:px-12 lg:px-16 py-10 ${className}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-10">
        {/* Logo + tagline */}
        <div className="min-w-[220px]">
          <Link to="/" className="inline-block">
            <img src="/login/logo.svg" alt="KidDiary" className="w-32 mb-3" />
          </Link>
          <p className="text-sm leading-relaxed max-w-[220px]">
            Bringing a little more joy to parenthood.
          </p>
        </div>

        {/* Menu columns */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
          <div>
            <h4 className="font-semibold mb-2">About</h4>
            <ul className="space-y-1">
              <li><Link to="/about" className="hover:text-[#48A6A7]">About</Link></li>
              <li><Link to="/faq" className="hover:text-[#48A6A7]">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-[#48A6A7]">Contact us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Work with us</h4>
            <ul className="space-y-1">
              <li><Link to="/advertiser" className="hover:text-[#48A6A7]">Advertiser</Link></li>
              <li><Link to="/investors" className="hover:text-[#48A6A7]">Investors</Link></li>
              <li><Link to="/career" className="hover:text-[#48A6A7]">Career</Link></li>
              <li><Link to="/business" className="hover:text-[#48A6A7]">For business</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Product</h4>
            <ul className="space-y-1">
              <li><Link to="/photobook" className="hover:text-[#48A6A7]">Photobook</Link></li>
            </ul>
          </div>
        </div>

        {/* Social icons */}
        <div className="flex lg:justify-end items-start gap-4 text-xl">
          <a href="#" aria-label="Facebook" className="hover:text-[#48A6A7]"><FaFacebookF /></a>
          <a href="#" aria-label="Instagram" className="hover:text-[#48A6A7]"><FaInstagram /></a>
          <a href="#" aria-label="YouTube" className="hover:text-[#48A6A7]"><FaYoutube /></a>
          <a href="#" aria-label="TikTok" className="hover:text-[#48A6A7]"><FaTiktok /></a>
          <a href="#" aria-label="Twitter/X" className="hover:text-[#48A6A7]"><FaXTwitter /></a>
          <a href="#" aria-label="Pinterest" className="hover:text-[#48A6A7]"><FaPinterest /></a>
        </div>
      </div>

      {/* Bottom line */}
      <div className="text-center text-xs text-gray-500 mt-8 border-t pt-4">
        © {new Date().getFullYear()} KidDiary. All rights reserved.
      </div>
    </footer>
  );
}

// ProfileMenu.jsx
import React, { useState, useEffect } from "react";
import { Avatar, Menu, MenuItem, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUserProfileService } from "../../services/userService";
// (tuỳ) import axios từ nơi bạn cấu hình instance
// import axios from "../../services/axios"; 

export default function ProfileMenu({ onOpenProfile, onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // --- DEFAULT HANDLERS (khi parent không truyền props) ---
  const gotoProfile = onOpenProfile ?? (() => navigate("/profile"));
  const doLogout =
    onLogout ??
    (() => {
      try {
        localStorage.removeItem("token");
        // Nếu bạn set Authorization default cho axios, clear luôn:
        // axios.defaults.headers.common["Authorization"] = "";
      } finally {
        navigate("/login", { replace: true });
      }
    });

  // ---- Helpers ----
  const absUrl = (img) =>
    img?.startsWith("http") ? img : `${import.meta.env.VITE_BACKEND_URL}${img}`;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const res = await getUserProfileService();
        if (res?.data?.errCode === 0) {
          const u = res.data.data || {};
          setUserData({
            name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Username",
            email: u.email || "user@email.com",
            image: u.image || "https://i.pravatar.cc/100?img=12",
          });
        } else {
          // fallback
          setUserData({
            name: "Username",
            email: "user@email.com",
            image: "https://i.pravatar.cc/100?img=12",
          });
        }
      } catch (e) {
        setUserData({
          name: "Username",
          email: "user@email.com",
          image: "https://i.pravatar.cc/100?img=12",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const display = userData || {
    name: "Username",
    email: "user@email.com",
    image: "https://i.pravatar.cc/100?img=12",
  };

  return (
    <div>
      <Avatar
        src={absUrl(display.image)}
        alt="profile"
        onClick={handleClick}
        className="cursor-pointer w-10 h-10 border"
      />

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{ className: "rounded-xl shadow-xl mt-2 min-w-[240px] overflow-hidden" }}
      >
        <div className="px-4 py-3 flex items-center gap-3">
          <Avatar src={absUrl(display.image)} alt="profile" className="w-12 h-12" />
          <div>
            <div className="font-semibold text-base text-gray-800">
              {loading ? "Đang tải..." : display.name}
            </div>
            <div className="text-sm text-gray-500">{loading ? "" : display.email}</div>
          </div>
        </div>

        <Divider />

        <MenuItem
          onClick={() => {
      onOpenProfile ? onOpenProfile() : navigate("/home/profile");
    }}
          className="hover:bg-gray-100 text-gray-700"
        >
          Hồ sơ cá nhân
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleClose();
            doLogout();      // dùng default nếu prop không có
          }}
          className="hover:bg-gray-100 text-red-500 font-medium"
        >
          Đăng xuất
        </MenuItem>
      </Menu>
    </div>
  );
}

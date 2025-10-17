// ProfileMenu.jsx
import React, { useState, useEffect } from "react";
import { Avatar, Menu, MenuItem, Divider } from "@mui/material";
import { getUserProfileService } from "../../services/userService";

export default function ProfileMenu({ onOpenProfile, onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    onLogout?.(); // gọi callback logout từ Home
  };

  // Fetch user profile khi mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await getUserProfileService();
        if (response.data && response.data.errCode === 0) {
          const user = response.data.data;
          setUserData({
            name:
              `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              "Username",
            email: user.email || "user@email.com",
            image: user.image || "https://i.pravatar.cc/100?img=12", // Fallback mock
          });
        } else {
          console.error(
            "Failed to fetch user profile:",
            response.data?.message
          );
          // Có thể fallback hoặc redirect login
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Fallback mock nếu fail
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

  // Fallback data nếu chưa load xong
  const displayData = userData || {
    name: "Username",
    email: "user@email.com",
    image: "https://i.pravatar.cc/100?img=12",
  };

  return (
    <div>
      {/* Avatar trigger */}
      <Avatar
        src={`${import.meta.env.VITE_BACKEND_URL}${displayData.image}`}
        alt="profile"
        onClick={handleClick}
        className="cursor-pointer w-10 h-10 border"
      />

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          className: "rounded-xl shadow-xl mt-2 min-w-[240px] overflow-hidden",
        }}
      >
        {/* Info */}
        <div className="px-4 py-3 flex items-center gap-3">
          <Avatar
            src={`${import.meta.env.VITE_BACKEND_URL}${displayData.image}`}
            alt="profile"
            className="w-12 h-12"
          />
          <div>
            <div className="font-semibold text-base text-gray-800">
              {loading ? "Đang tải..." : displayData.name}
            </div>
            <div className="text-sm text-gray-500">
              {loading ? "" : displayData.email}
            </div>
          </div>
        </div>

        <Divider />

        {/* Buttons */}
        <MenuItem
          onClick={() => {
            handleClose();
            onOpenProfile?.(); // 👈 gọi callback
          }}
          className="hover:bg-gray-100 text-gray-700"
        >
          Hồ sơ cá nhân
        </MenuItem>

        <MenuItem
          onClick={handleLogout}
          className="hover:bg-gray-100 text-red-500 font-medium"
        >
          Đăng xuất
        </MenuItem>
      </Menu>
    </div>
  );
}

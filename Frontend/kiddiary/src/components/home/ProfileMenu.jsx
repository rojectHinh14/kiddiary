// ProfileMenu.jsx
import React, { useState } from "react";
import { Avatar, Menu, MenuItem, Divider } from "@mui/material";

export default function ProfileMenu({ onOpenProfile, onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    onLogout?.(); // gọi callback logout từ Home
  };

  return (
    <div>
      {/* Avatar trigger */}
      <Avatar
        src="https://i.pravatar.cc/100?img=12"
        alt="profile"
        onClick={handleClick}
        className="cursor-pointer w-10 h-10 border"
      />

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          className:
            "rounded-xl shadow-xl mt-2 min-w-[240px] overflow-hidden",
        }}
      >
        {/* Info */}
        <div className="px-4 py-3 flex items-center gap-3">
          <Avatar
            src="https://i.pravatar.cc/100?img=12"
            alt="profile"
            className="w-12 h-12"
          />
          <div>
            <div className="font-semibold text-base text-gray-800">
              Username
            </div>
            <div className="text-sm text-gray-500">user@email.com</div>
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

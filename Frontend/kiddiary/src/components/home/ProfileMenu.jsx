// src/components/home/ProfileMenu.jsx
import React, { useState, useEffect } from "react";
import { Avatar, Menu, MenuItem, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { getUserProfileService } from "../../services/userService";

export default function ProfileMenu({ onOpenProfile, onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Handlers mặc định nếu không truyền từ parent
  const gotoProfile = onOpenProfile ?? (() => navigate("/home/profile"));
  const doLogout =
    onLogout ??
    (() => {
      try {
        localStorage.removeItem("token");
      } finally {
        navigate("/login", { replace: true });
      }
    });

  const absUrl = (img) =>
    img?.startsWith?.("http")
      ? img
      : `${import.meta.env.VITE_BACKEND_URL}${img}`;

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getUserProfileService();
        if (res?.data?.errCode === 0) {
          const u = res.data.data || {};
          setUserData({
            name:
              `${u.firstName || ""} ${u.lastName || ""}`.trim() || "Username",
            email: u.email || "user@email.com",
            image: u.image || "https://i.pravatar.cc/100?img=12",
          });
        } else {
          setUserData({
            name: "Username",
            email: "user@email.com",
            image: "https://i.pravatar.cc/100?img=12",
          });
        }
      } catch {
        setUserData({
          name: "Username",
          email: "user@email.com",
          image: "https://i.pravatar.cc/100?img=12",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const display = userData || {
    name: "Username",
    email: "user@email.com",
    image: "https://i.pravatar.cc/100?img=12",
  };

  return (
    <div>
      {/* Nút avatar */}
      <Avatar
        src={absUrl(display.image)}
        alt="profile"
        onClick={handleClick}
        className="cursor-pointer w-10 h-10 ring-1 ring-black/5 hover:ring-teal-300/60 transition"
      />

      {/* Popover */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        elevation={0}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            mt: 1,
            overflow: "visible",
            borderRadius: 12,
            bgcolor: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(6px)",
            boxShadow: "0 8px 24px rgba(2,6,23,0.12)",
            border: "1px solid rgba(2,6,23,0.06)",
            minWidth: 220,
            maxWidth: 260,
            // ⚠️ Dùng "px" để tránh nhân theo theme.spacing
            "& .MuiMenuItem-root": {
              fontSize: 14,
              paddingBlock: "8px",
              paddingInline: "10px",
              borderRadius: "10px",
              minHeight: "unset",
            },
            // Mũi tên trỏ avatar
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "inherit",
              transform: "translateY(-50%) rotate(45deg)",
              borderLeft: "1px solid rgba(2,6,23,0.06)",
              borderTop: "1px solid rgba(2,6,23,0.06)",
              zIndex: 0,
            },
          },
        }}
        // List compact
        MenuListProps={{ dense: true, sx: { p: 0.5 } }}
      >
        {/* Header nhỏ gọn */}
        <div className="m-2 px-3 py-2 flex items-center gap-2.5 rounded-lg bg-teal-50">
          <Avatar
            src={absUrl(display.image)}
            alt="profile"
            className="w-9 h-9 ring-1 ring-black/5"
          />
          <div className="min-w-0">
            <div className="font-semibold text-[14px] text-gray-900 truncate">
              {loading ? "Đang tải..." : display.name}
            </div>
            <div className="text-[12px] text-gray-500 truncate">
              {loading ? "" : display.email}
            </div>
          </div>
        </div>

        <Divider className="!my-1" />

        {/* Items */}
        <div className="p-3">
          <MenuItem
            onClick={() => {
              handleClose();
              gotoProfile();
            }}
            className="hover:!bg-teal-50"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-teal-100 text-teal-700">
              <User size={16} />
            </span>
            <span className="ml-2">My profile</span>
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClose();
              doLogout();
            }}
            className="hover:!bg-red-50 !text-red-600"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-red-100">
              <LogOut size={16} />
            </span>
            <span className="ml-2">Log out</span>
          </MenuItem>
        </div>
      </Menu>
    </div>
  );
}

// AlbumCard.jsx
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";

export default function AlbumCard({ album, onOpen, onAddToAlbum, onDelete }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete();
    setAnchorEl(null);
  };

  return (
    <div className="group cursor-pointer relative" onClick={onOpen}>
      {/* Album cover */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-black/5">
        <img
          src={album.coverUrl}
          alt={album.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

        {/* Nút 3 chấm - chỉ hiện khi hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <IconButton
            size="small"
            onClick={handleMenuClick}
            className="bg-white/90 hover:bg-white shadow-md"
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </div>
      </div>

      {/* Title + count */}
      <div className="mt-2 flex items-center justify-between">
        <div className="font-medium">{album.title}</div>
        <div className="text-sm text-gray-500">
          {album.photos.length} {album.photos.length === 1 ? "photo" : "photos"}
        </div>
      </div>

      {/* Add moments button */}
      {onAddToAlbum && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToAlbum();
          }}
          className="mt-2 w-full px-3 py-1 text-xs bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-md hover:bg-[#FF6B6B]/20 transition-colors"
        >
          Add moments to album
        </button>
      )}

      {/* Menu 3 chấm */}
      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        PaperProps={{
          style: { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
        }}
      >
        <MenuItem
          onClick={handleDeleteClick}
          sx={{ color: "#ef4444", fontSize: "0.875rem" }}
        >
          Delete album
        </MenuItem>
      </Menu>
    </div>
  );
}

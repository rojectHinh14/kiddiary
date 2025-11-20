// src/components/ConfirmDeleteAlbumDialog.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function ConfirmDeleteAlbumDialog({
  open,
  albumTitle = "",
  onClose,
  onConfirm,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete album?</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Are you sure you want to delete the album{" "}
          <strong>"{albumTitle}"</strong>?
        </Typography>
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          This action will permanently delete the album and all photos inside
          it. It cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="error">
          Delete Album
        </Button>
      </DialogActions>
    </Dialog>
  );
}

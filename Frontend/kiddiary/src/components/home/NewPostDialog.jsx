import React, { useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/**
 * Props:
 *  open: boolean
 *  onClose: () => void
 *  onSubmit?: (payload: { files: File[], caption: string, date: string, people: string }) => void
 */
export default function NewPostDialog({ open, onClose, onSubmit }) {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [people, setPeople] = useState("");

  const previews = useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files]
  );

  const pickFiles = () => fileInputRef.current?.click();

  const onDrop = (e) => {
    e.preventDefault();
    const flist = Array.from(e.dataTransfer.files || []).filter((f) =>
      /image|video/.test(f.type)
    );
    if (flist.length) setFiles((prev) => [...prev, ...flist]);
  };

  const onBrowse = (e) => {
    const flist = Array.from(e.target.files || []).filter((f) =>
      /image|video/.test(f.type)
    );
    if (flist.length) setFiles((prev) => [...prev, ...flist]);
  };

  const handleSubmit = () => {
    onSubmit?.({ files, caption, date, people });
    // tuỳ bạn có muốn reset form không
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        className:
          "rounded-2xl overflow-hidden bg-white shadow-xl !max-w-[980px]",
      }}
    >
      {/* Title */}
      <DialogTitle className="relative text-center text-[28px] font-semibold tracking-tight bg-[#FBF4EE]">
        Add moments
        <IconButton
          onClick={onClose}
          size="small"
          className="!absolute !right-3 !top-3"
          aria-label="Close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Body */}
      <DialogContent className="bg-[#FBF4EE]">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-8 items-start pt-6">
          {/* Upload box */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="rounded-2xl border-2 border-dashed border-gray-300 bg-white/50 min-h-[320px] flex flex-col items-center justify-center text-center px-4"
          >
            {previews.length === 0 ? (
              <>
                <p className="text-gray-500">
                  Drag your videos and images
                  <br /> here or{" "}
                  <button
                    type="button"
                    onClick={pickFiles}
                    className="text-[#E95348] underline underline-offset-2"
                  >
                    browse
                  </button>{" "}
                  to upload
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  hidden
                  onChange={onBrowse}
                />
              </>
            ) : (
              <div className="w-full p-3 grid grid-cols-3 gap-3">
                {previews.map((src, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-xl overflow-hidden bg-black/5"
                  >
                    <img
                      src={src}
                      alt={`preview-${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form fields */}
          <div className="flex flex-col gap-4">
            {/* Caption */}
            <TextField
              placeholder="Write about this moment, and remember it forever"
              multiline
              minRows={5}
              fullWidth
              variant="outlined"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              InputProps={{
                className:
                  "!bg-white !rounded-xl !border !border-gray-200 focus:!border-gray-300",
              }}
            />

            {/* Date */}
            <TextField
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              InputProps={{
                className:
                  "!bg-white !rounded-xl !border !border-gray-200 px-3 py-2",
              }}
            />

            {/* People */}
            <div>
              <div className="text-gray-700 mb-2">Who&apos;s in this moment?</div>
              <TextField
                placeholder="Type names, separated by commas"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                fullWidth
                InputProps={{
                  className:
                    "!bg-white !rounded-xl !border !border-gray-200 px-3 py-2",
                }}
              />
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Footer */}
      <DialogActions className="bg-[#FBF4EE] px-8 py-6">
        <div className="ml-auto flex items-center gap-3">
          <Button
            onClick={onClose}
            variant="contained"
            className="!bg-[#CFCFCF] !text-black !rounded-lg !px-5 !py-2 normal-case hover:!bg-[#BFBFBF]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            className="!bg-[#F05349] !text-white !rounded-lg !px-5 !py-2 normal-case hover:!bg-[#e3463b]"
            disabled={!caption && files.length === 0}
          >
            Add a moment
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}

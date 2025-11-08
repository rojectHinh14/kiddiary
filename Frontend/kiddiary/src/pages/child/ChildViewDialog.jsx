// src/features/children/ChildViewDialog.jsx
import { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearViewing, updateOneChild } from "../../store/slice/childrenSlice";
import { fileToBase64 } from "../../services/childService";

const toInputDate = (d) => (!d ? "" : new Date(d).toISOString().slice(0, 10));

export default function ChildViewDialog() {
  const dispatch = useDispatch();
  const child = useSelector((s) => s.children.viewing); // ⬅️ lấy từ Redux
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  // Nếu chưa chọn child thì không render
  if (!child) return null;

  // lấy BASE để chuẩn hoá preview ảnh khi server trả /uploads/...
  const BASE = import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "") || "";
  const abs = (p) => {
    if (!p || typeof p !== "string") return null;
    let url = p.trim().replace(/\\/g, "/").replace(/^\.\/+/, "");
    if (/^https?:\/\//i.test(url)) return url;
    if (url.startsWith("/")) return `${BASE}${url}`;
    return `${BASE}/${url}`;
  };
  const pickImageKey = (c) =>
    c.image ?? c.avatar ?? c.avatarUrl ?? c.photo ?? c.photoUrl ?? c.profileImage ?? c.picture ?? c.img ?? c.imageUrl ?? c.fileUrl ?? null;

  const [form, setForm] = useState(() => ({
    firstName: child.firstName || "",
    lastName: child.lastName || "",
    dob: toInputDate(child.dob),
    weight: child.weight ?? "",
    height: child.height ?? "",
    genderCode: child.genderCode || "",
    avatarBase64: "",
    preview: abs(pickImageKey(child)),
  }));

  // nếu viewing đổi (chọn child khác), sync lại form
  useEffect(() => {
    setForm({
      firstName: child.firstName || "",
      lastName: child.lastName || "",
      dob: toInputDate(child.dob),
      weight: child.weight ?? "",
      height: child.height ?? "",
      genderCode: child.genderCode || "",
      avatarBase64: "",
      preview: abs(pickImageKey(child)),
    });
    setEdit(false);
    setErr(null);
  }, [child]); // eslint-disable-line

  const payload = useMemo(() => {
    const p = {
      firstName: (form.firstName || "").trim(),
      lastName: (form.lastName || "").trim(),
      weight: form.weight === "" ? null : Number(form.weight),
      height: form.height === "" ? null : Number(form.height),
      genderCode: form.genderCode || "",
    };
    if (form.dob) p.dob = new Date(form.dob).toISOString();
    if (form.avatarBase64) p.avatarBase64 = form.avatarBase64; // chỉ gửi khi đổi ảnh
    return p;
  }, [form]);

  const pickFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const b64 = await fileToBase64(f);
    setForm((s) => ({ ...s, avatarBase64: b64, preview: b64 }));
  };

  const save = async () => {
    try {
      setSaving(true);
      setErr(null);
     await dispatch(updateOneChild({ id: child.id, payload })).unwrap();
dispatch(clearViewing()); // ⬅️ cập nhật store
      setEdit(false);
    } catch (e) {
      setErr(String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onMouseDown={(e)=>{ if(e.target===e.currentTarget) dispatch(clearViewing()); }}>
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl" onMouseDown={(e)=>e.stopPropagation()}>
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{edit ? "Edit child" : "Child details"}</h2>
          <div className="flex gap-2">
            {!edit ? (
              <button onClick={() => setEdit(true)} className="rounded-lg border px-3 py-1.5">Edit</button>
            ) : (
              <button onClick={() => setEdit(false)} className="rounded-lg border px-3 py-1.5">Cancel</button>
            )}
            <button onClick={() => dispatch(clearViewing())} className="rounded-lg border px-3 py-1.5">Close</button>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[160px,1fr]">
          <div className="flex flex-col items-center gap-2">
            <img src={form.preview || "/placeholder-avatar.png"} alt="avatar"
                 className="h-40 w-40 rounded-full object-cover border" />
            {edit && (
              <label className="mt-2 cursor-pointer text-sm underline">
                Change photo
                <input type="file" accept="image/*" onChange={pickFile} className="hidden" />
              </label>
            )}
          </div>

          {!edit ? (
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {`${form.firstName} ${form.lastName}`.trim() || "—"}</p>
              <p><span className="font-medium">DOB:</span> {form.dob || "—"}</p>
              <p><span className="font-medium">Gender:</span> {form.genderCode || "—"}</p>
              <p><span className="font-medium">Height:</span> {form.height || "—"}</p>
              <p><span className="font-medium">Weight:</span> {form.weight || "—"}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm">First name</label>
                <input className="mt-1 w-full rounded-lg border p-2"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              </div>
              <div>
                <label className="text-sm">Last name</label>
                <input className="mt-1 w-full rounded-lg border p-2"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </div>

              <div>
                <label className="text-sm">DOB</label>
                <input type="date" className="mt-1 w-full rounded-lg border p-2"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })} />
              </div>

              <div>
                <label className="text-sm">Gender</label>
                <select
                  className="mt-1 w-full rounded-lg border p-2"
                  value={form.genderCode || ""}
                  onChange={(e) => setForm({ ...form, genderCode: e.target.value })}
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>

              <div>
                <label className="text-sm">Height (cm)</label>
                <input type="number" className="mt-1 w-full rounded-lg border p-2"
                  value={form.height}
                  onChange={(e) => setForm({ ...form, height: e.target.value })} />
              </div>
              <div>
                <label className="text-sm">Weight (kg)</label>
                <input type="number" className="mt-1 w-full rounded-lg border p-2"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })} />
              </div>
            </div>
          )}
        </div>

        {err && <p className="mt-4 text-sm text-red-600">{err}</p>}
        {edit && (
          <div className="mt-5 flex justify-end">
            <button disabled={saving} onClick={save}
              className={`rounded-xl bg-teal-600 px-5 py-2 text-white hover:bg-teal-700 ${saving ? "opacity-60" : ""}`}>
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

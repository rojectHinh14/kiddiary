import { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearViewing, updateOneChild } from "../../store/slice/childrenSlice";
import { fileToBase64 } from "../../services/childService";

const toInputDate = (d) => (!d ? "" : new Date(d).toISOString().slice(0, 10));

const getLatestMeasurement = (child) => {
  if (
    !child?.histories ||
    !Array.isArray(child.histories) ||
    child.histories.length === 0
  ) {
    return { weight: "", height: "", latestDate: null };
  }
  // Sắp xếp để phần tử mới nhất lên đầu
  const sorted = [...child.histories].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const latest = sorted[0];
  return {
    weight: latest.weight ?? "",
    height: latest.height ?? "",
    latestDate: latest.date,
  };
};

export default function ChildViewDialog() {
  const dispatch = useDispatch();
  const child = useSelector((s) => s.children.viewing);

  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  // Nếu chưa chọn child thì không render
  if (!child) return null;

  // Chuẩn hoá URL ảnh
  const BASE = import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "") || "";
  const abs = (p) => {
    if (!p || typeof p !== "string") return null;
    let url = p
      .trim()
      .replace(/\\/g, "/")
      .replace(/^\.\/+/, "");
    if (/^https?:\/\//i.test(url)) return url;
    if (url.startsWith("/")) return `${BASE}${url}`;
    return `${BASE}/${url}`;
  };

  const pickImageKey = (c) =>
    c.image ??
    c.avatar ??
    c.avatarUrl ??
    c.photo ??
    c.photoUrl ??
    c.profileImage ??
    c.picture ??
    c.img ??
    c.imageUrl ??
    c.fileUrl ??
    null;

  // Lấy measurement mới nhất
  const {
    weight: latestWeight,
    height: latestHeight,
    latestDate,
  } = useMemo(() => getLatestMeasurement(child), [child]);

  // Form state
  const [form, setForm] = useState({
    firstName: child.firstName || "",
    lastName: child.lastName || "",
    dob: toInputDate(child.dob),
    weight: latestWeight,
    height: latestHeight,
    genderCode: child.genderCode || "",
    avatarBase64: "",
    preview: abs(pickImageKey(child)),
  });

  // Khi chuyển sang child khác → reset form
  useEffect(() => {
    setForm({
      firstName: child.firstName || "",
      lastName: child.lastName || "",
      dob: toInputDate(child.dob),
      weight: latestWeight,
      height: latestHeight,
      genderCode: child.genderCode || "",
      avatarBase64: "",
      preview: abs(pickImageKey(child)),
    });
    setEdit(false);
    setErr(null);
  }, [child, latestWeight, latestHeight]);

  // Payload gửi lên server khi save
  const payload = useMemo(() => {
    const p = {
      firstName: (form.firstName || "").trim(),
      lastName: (form.lastName || "").trim(),
      genderCode: form.genderCode || "",
    };

    if (form.dob) p.dob = new Date(form.dob).toISOString();
    if (form.weight !== "") p.weight = Number(form.weight);
    if (form.height !== "") p.height = Number(form.height);
    if (form.avatarBase64) p.avatarBase64 = form.avatarBase64;

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
      dispatch(clearViewing());
      setEdit(false);
    } catch (e) {
      setErr(e?.message || String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) dispatch(clearViewing());
      }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {edit ? "Edit child" : "Child details"}
          </h2>
          <div className="flex gap-2">
            {!edit ? (
              <button
                onClick={() => setEdit(true)}
                className="rounded-lg border px-3 py-1.5 text-sm font-medium"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={() => setEdit(false)}
                className="rounded-lg border px-3 py-1.5 text-sm font-medium"
              >
                Cancel
              </button>
            )}
            <button
              onClick={() => dispatch(clearViewing())}
              className="rounded-lg border px-3 py-1.5 text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[160px,1fr]">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <img
              src={form.preview || "/placeholder-avatar.png"}
              alt="avatar"
              className="h-40 w-40 rounded-full object-cover border-4 border-gray-100"
            />
            {edit && (
              <label className="cursor-pointer text-sm text-teal-600 underline hover:text-teal-700">
                Change photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={pickFile}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Thông tin */}
          <div className="space-y-3">
            {!edit ? (
              <>
                <p className="text-lg font-medium text-slate-900">
                  {`${form.firstName} ${form.lastName}`.trim() ||
                    "Unnamed child"}
                </p>
                <div className="space-y-2 text-sm text-slate-600">
                  <p>
                    <span className="font-medium text-slate-800">
                      Date of birth:
                    </span>{" "}
                    {form.dob
                      ? new Date(form.dob).toLocaleDateString("vi-VN")
                      : "—"}
                  </p>
                  <p>
                    <span className="font-medium text-slate-800">Gender:</span>{" "}
                    {form.genderCode === "M"
                      ? "Male"
                      : form.genderCode === "F"
                      ? "Female"
                      : "—"}
                  </p>
                  <p>
                    <span className="font-medium text-slate-800">Height:</span>{" "}
                    {form.height ? `${form.height} cm` : "—"}
                  </p>
                  <p>
                    <span className="font-medium text-slate-800">Weight:</span>{" "}
                    {form.weight ? `${form.weight} kg` : "—"}
                  </p>
                  {latestDate && (
                    <p className="text-xs text-slate-500">
                      Measurement date:{" "}
                      {new Date(latestDate).toLocaleDateString("vi-VN")}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    First name
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Last name
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Date of birth
                  </label>
                  <input
                    type="date"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={form.dob}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Gender
                  </label>
                  <select
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={form.genderCode}
                    onChange={(e) =>
                      setForm({ ...form, genderCode: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={form.height}
                    onChange={(e) =>
                      setForm({ ...form, height: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={form.weight}
                    onChange={(e) =>
                      setForm({ ...form, weight: e.target.value })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error & Save button */}
        {err && <p className="mt-4 text-sm text-red-600">{err}</p>}

        {edit && (
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setEdit(false)}
              className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              disabled={saving}
              onClick={save}
              className={`rounded-lg bg-teal-600 px-6 py-2 text-white font-medium hover:bg-teal-700 disabled:opacity-60`}
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useRef, useState, useEffect } from "react";
import {
  getUserProfileService,
  updateUserService,
} from "../../services/userService";

export default function Profile() {
  const [data, setData] = useState({
    id: null, // Thêm để lưu userId từ API
    firstName: "Alexa",
    lastName: "Rawles",
    email: "alexarawles@gmail.com",
    password: "••••••••",
    address: "",
    phoneNumber: "",
    gender: "female",
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=400",
  });

  const [editing, setEditing] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfileService();
      if (response.data && response.data.errCode === 0) {
        const userData = response.data.data;
        setData({
          id: userData.id,
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          password: "••••••••",
          address: userData.address || "",
          phoneNumber: userData.phoneNumber || "",
          gender: userData.gender || "female",
          image: userData.image || data.image, // Fallback mock nếu không có
        });
      } else {
        console.error("Failed to fetch profile:", response.data?.message);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      alert("Không thể tải thông tin profile. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setData((p) => ({ ...p, [name]: value }));
  };

  const onPickFile = () => fileRef.current?.click();
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setData((p) => ({ ...p, image: url, _file: f }));
  };

  const cancelEdit = () => {
    setEditing(false);
    setShowPwd(false);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!data.id) {
      alert("Không tìm thấy ID người dùng. Vui lòng tải lại trang.");
      return;
    }

    setLoading(true);
    try {
      // Chuẩn bị data gửi lên
      let updateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        address: data.address,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
      };

      // Chỉ gửi password nếu thay đổi (không phải giá trị mặc định)
      if (data.password && data.password !== "••••••••") {
        updateData.password = data.password;
      }

      if (data._file) {
        const base64Promise = new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result); // data:image/...base64
          reader.readAsDataURL(data._file);
        });
        const base64Image = await base64Promise;
        updateData.image = base64Image;
      }

      const response = await updateUserService(data.id, updateData);
      if (response.data && response.data.errCode === 0) {
        console.log("Profile updated successfully:", response.data);
        await fetchProfile();
        alert("Cập nhật profile thành công!");
      } else {
        console.error("Update failed:", response.data?.message);
        alert(`Lỗi cập nhật: ${response.data?.message || "Server error"}`);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Không thể cập nhật profile. Vui lòng thử lại.");
    } finally {
      setLoading(false);
      setEditing(false);
      setShowPwd(false);
    }
  };

  // Disable toàn bộ form khi loading
  if (loading && !editing) {
    return (
      <div className="min-h-screen bg-[#FAFAFD] p-6 sm:p-10 flex items-center justify-center">
        Đang tải...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFD] sm:p-10">
      {/* Card */}
      <div className="mx-auto w-full max-w-5xl rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        {/* Header */}
        <div className="flex items-start gap-5 p-6 sm:p-8 border-b">
          {/* Avatar + upload */}
          <div className="relative">
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}${data.image}`}
              alt="avatar"
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover ring-2 ring-white shadow"
            />
            {editing && (
              <>
                <button
                  type="button"
                  onClick={onPickFile}
                  className="absolute -bottom-1 -right-1 rounded-full bg-white shadow px-3 py-1 text-xs font-medium hover:bg-gray-50"
                >
                  Change
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={onFile}
                />
              </>
            )}
          </div>

          {/* Name + email */}
          <div className="flex-1">
            <div className="text-xl sm:text-2xl font-semibold text-gray-900">
              {data.firstName} {data.lastName}
            </div>
            <div className="text-gray-500">{data.email}</div>
          </div>

          {/* Edit / Save */}
          <div className="ml-auto">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                disabled={loading}
                className="rounded-lg bg-[#4A77FF] text-white px-4 py-2 text-sm font-medium shadow hover:brightness-95 disabled:opacity-50"
              >
                Edit
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={cancelEdit}
                  type="button"
                  disabled={loading}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-[#4A77FF] text-white px-4 py-2 text-sm font-medium shadow hover:brightness-95 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            )}
          </div>
        </div>
 
        {/* Form */}
        <form onSubmit={save} className="p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* First name */}
            <Field
              label="First Name"
              name="firstName"
              value={data.firstName}
              onChange={onChange}
              disabled={!editing || loading}
            />
            {/* Last name */}
            <Field
              label="Last Name"
              name="lastName"
              value={data.lastName}
              onChange={onChange}
              disabled={!editing || loading}
            />

            {/* Email */}
            <Field
              label="Email"
              type="email"
              name="email"
              value={data.email}
              onChange={onChange}
              disabled={!editing || loading}
            />

            {/* Password */}
            <Field
              label="Password"
              type={showPwd ? "text" : "password"}
              name="password"
              value={data.password}
              onChange={onChange}
              disabled={!editing || loading}
              rightEl={
                editing &&
                !loading && (
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    {showPwd ? "Hide" : "Show"}
                  </button>
                )
              }
            />

            {/* Address (full width on small) */}
            <Field
              className="sm:col-span-2"
              label="Address"
              name="address"
              value={data.address}
              onChange={onChange}
              disabled={!editing || loading}
            />

            {/* phoneNumber */}
            <Field
              label="Telephone"
              name="phoneNumber"
              value={data.phoneNumber}
              onChange={onChange}
              disabled={!editing || loading}
            />

            {/* Gender */}
            <div>
              <Label>Gender</Label>
              <select
                name="gender"
                value={data.gender}
                onChange={onChange}
                disabled={!editing || loading}
                className={`w-full rounded-xl border bg-white px-3 py-2.5 outline-none transition
                ${
                  editing && !loading
                    ? "border-gray-300 focus:border-gray-400"
                    : "border-gray-200 text-gray-500 bg-gray-50"
                }`}
              >
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Email list block như ảnh mẫu (simple) */}
          <div className="mt-8">
            <div className="text-sm font-semibold text-gray-800 mb-3">
              My email address
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-4">
              <span className="mt-1 inline-block h-4 w-4 rounded-full bg-[#4A77FF]" />
              <div className="text-sm">
                <div className="text-gray-800">{data.email}</div>
                <div className="text-gray-400 text-xs">
                  primary • 1 month ago
                </div>
              </div>
            </div>

            {editing && !loading && (
              <button
                type="button"
                className="mt-3 text-sm rounded-lg bg-gray-100 px-3 py-2 hover:bg-gray-200"
              >
                + Add Email Address
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- small reusable subcomponents ---------- */

function Label({ children }) {
  return (
    <label className="mb-1 block text-sm font-medium text-gray-700">
      {children}
    </label>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  disabled,
  type = "text",
  className = "",
  rightEl,
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <div
        className={`flex items-center gap-2 rounded-xl border bg-white px-3 py-2.5
        ${
          disabled
            ? "border-gray-200 bg-gray-50 text-gray-500"
            : "border-gray-300 focus-within:border-gray-400"
        }
      `}
      >
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full bg-transparent outline-none text-sm"
          placeholder={`Your ${label}`}
        />
        {rightEl}
      </div>
    </div>
  );
}

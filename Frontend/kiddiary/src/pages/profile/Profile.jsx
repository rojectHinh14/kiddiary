import React, { useRef, useState } from "react";

export default function Profile() {
  // mock data ban đầu – sau này bạn map từ API
  const [data, setData] = useState({
    firstName: "Alexa",
    lastName: "Rawles",
    email: "alexarawles@gmail.com",
    password: "••••••••",
    address: "",
    phone: "",
    gender: "female",
    image:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=400",
  });

  const [editing, setEditing] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const fileRef = useRef(null);

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
    // TODO: nếu có state original, khôi phục; tạm thời chỉ tắt edit
    setEditing(false);
    setShowPwd(false);
  };

  const save = (e) => {
    e.preventDefault();
    // TODO: gọi API update profile (data & data._file)
    console.log("Submit profile", data);
    setEditing(false);
    setShowPwd(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFD] p-6 sm:p-10">
      {/* Card */}
      <div className="mx-auto w-full max-w-5xl rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
        {/* Header */}
        <div className="flex items-start gap-5 p-6 sm:p-8 border-b">
          {/* Avatar + upload */}
          <div className="relative">
            <img
              src={data.image}
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
                className="rounded-lg bg-[#4A77FF] text-white px-4 py-2 text-sm font-medium shadow hover:brightness-95"
              >
                Edit
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={cancelEdit}
                  type="button"
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  type="submit"
                  className="rounded-lg bg-[#4A77FF] text-white px-4 py-2 text-sm font-medium shadow hover:brightness-95"
                >
                  Save
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
              disabled={!editing}
            />
            {/* Last name */}
            <Field
              label="Last Name"
              name="lastName"
              value={data.lastName}
              onChange={onChange}
              disabled={!editing}
            />

            {/* Email */}
            <Field
              label="Email"
              type="email"
              name="email"
              value={data.email}
              onChange={onChange}
              disabled={!editing}
            />

            {/* Password */}
            <Field
              label="Password"
              type={showPwd ? "text" : "password"}
              name="password"
              value={data.password}
              onChange={onChange}
              disabled={!editing}
              rightEl={
                editing && (
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
              disabled={!editing}
            />

            {/* Phone */}
            <Field
              label="Phone Number"
              name="phone"
              value={data.phone}
              onChange={onChange}
              disabled={!editing}
            />

            {/* Gender */}
            <div>
              <Label>Gender</Label>
              <select
                name="gender"
                value={data.gender}
                onChange={onChange}
                disabled={!editing}
                className={`w-full rounded-xl border bg-white px-3 py-2.5 outline-none transition
                ${editing ? "border-gray-300 focus:border-gray-400" : "border-gray-200 text-gray-500 bg-gray-50"}`}
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
                <div className="text-gray-400 text-xs">primary • 1 month ago</div>
              </div>
            </div>

            {editing && (
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
        ${disabled ? "border-gray-200 bg-gray-50 text-gray-500" : "border-gray-300 focus-within:border-gray-400"}
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

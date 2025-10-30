import { useRef, useState } from "react";
import { createChildService } from "../../services/childService";

export default function ChildForm({ onCancel, onSave }) {
  const fileRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [fileBase64, setFileBase64] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [genderCode, setGenderCode] = useState(""); // M -> Male, F -> Female
  const [dob, setDob] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPhoto(url);

    // convert to base64
    const reader = new FileReader();
    reader.onloadend = () => setFileBase64(reader.result);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async () => {
    if (!firstName.trim()) return alert("Please enter child’s first name.");

    try {
      const res = await createChildService({
        firstName,
        lastName,
        dob,
        weight,
        height,
        genderCode,
        avatarBase64: fileBase64,
      });

      if (res.data?.errCode === 0) {
        alert("Child added successfully!");
        onSave(res.data.data);
      } else {
        alert(res.data?.message || "Error creating child.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while adding child.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-[#FFFCF8] w-[600px] rounded-2xl shadow-lg p-8">
        <h2 className="text-center text-xl font-semibold mb-6">Add a Child</h2>

        {/* Upload avatar */}
        <div className="flex flex-col items-center mb-6">
          <label className="text-sm mb-2 font-medium">Photo</label>
          <div className="relative w-28 h-28 rounded-full border flex items-center justify-center overflow-hidden bg-white">
            {photo ? (
              <img
                src={photo}
                alt="preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-12 h-12 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 14l9-5-9-5-9 5z"
                />
              </svg>
            )}
          </div>
          <input
            ref={fileRef}
            onChange={handleFile}
            type="file"
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileRef.current.click()}
            className="mt-2 text-sm text-[#2CC1AE] hover:underline"
          >
            Upload photo
          </button>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold">First name</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 w-full border rounded-full px-4 py-2"
              placeholder="First name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Last name</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 w-full border rounded-full px-4 py-2"
              placeholder="Last name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Gender</label>
            <select
              value={genderCode}
              onChange={(e) => setGenderCode(e.target.value)}
              className="mt-1 w-full border rounded-full px-4 py-2"
            >
              <option value="">Select gender</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold">Date of birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="mt-1 w-full border rounded-full px-4 py-2"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="mt-1 w-full border rounded-full px-4 py-2"
                placeholder="e.g., 12.5"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="mt-1 w-full border rounded-full px-4 py-2"
                placeholder="e.g., 85"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-full bg-gray-300 text-gray-700 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-full bg-[#FF6B6B] text-white font-semibold"
          >
            Save and continue
          </button>
        </div>
      </div>
    </div>
  );
}

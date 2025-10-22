import { useRef, useState } from "react";

export default function ChildForm({ onCancel, onSave }) {
  const fileRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setPhoto(url);
  };

  const handleSubmit = () => {
    if (!firstName.trim()) return alert("Please enter child’s name.");
    onSave({ firstName, lastName, gender, dob, photo });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="bg-[#FFFCF8] w-[600px] rounded-2xl shadow-lg p-8">
        <h2 className="text-center text-xl font-semibold mb-6">Add a Child</h2>

        <div className="flex flex-col items-center mb-6">
          <label className="text-sm mb-2 font-medium">Photo</label>
          <div className="relative w-28 h-28 rounded-full border flex items-center justify-center overflow-hidden bg-white">
            {photo ? (
              <img src={photo} alt="preview" className="object-cover w-full h-full" />
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
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
              </svg>
            )}
          </div>
          <input ref={fileRef} onChange={handleFile} type="file" accept="image/*" className="hidden" />
          <button
            onClick={() => fileRef.current.click()}
            className="mt-2 text-sm text-[#2CC1AE] hover:underline"
          >
            Upload photo
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold">Child’s first name</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 w-full border rounded-full px-4 py-2"
              placeholder="First name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Child’s last name</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 w-full border rounded-full px-4 py-2"
              placeholder="Last name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Gender</label>
            <input
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 w-full border rounded-full px-4 py-2"
              placeholder="e.g., Male / Female"
            />
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
        </div>

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

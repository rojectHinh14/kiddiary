import { useState } from "react";
import ChildForm from "./ChildForm";
import ChildCard from "../../components/child/ChildCard";

export default function ChildrenPanel() {
  const [children, setChildren] = useState([
    { id: 1, firstName: "Nguyen", gender: "Male", photo: null },
  ]);
  const [openForm, setOpenForm] = useState(false);

  const handleAddChild = (childData) => {
    const newChild = {
      id: crypto.randomUUID(),
      ...childData,
    };
    setChildren((prev) => [...prev, newChild]);
    setOpenForm(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] px-8 py-10">
      <h1 className="text-3xl font-semibold text-center mb-8">Children</h1>

      <div className="flex justify-center gap-10">
        {children.map((child) => (
          <ChildCard key={child.id} child={child} />))}

        <div
          onClick={() => setOpenForm(true)}
          className="cursor-pointer flex flex-col items-center"
        >
          <div className="w-40 h-40 rounded-full bg-gray-50 flex items-center justify-center border">
            <span className="text-4xl text-gray-400">＋</span>
          </div>
          <p className="mt-2 text-sm text-gray-700">Add</p>
        </div>
      </div>

      {openForm && (
        <ChildForm
          onCancel={() => setOpenForm(false)}
          onSave={handleAddChild}
        />
      )}
    </div>
  );
}

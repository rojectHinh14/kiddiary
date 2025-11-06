import { format } from "date-fns";
import { useEffect, useState } from "react";

/**
 * items: [{ id, description, images: [url,...] }]
 * onUpdateMoment(id, patch: { description?: string, images?: FileList|string[] })
 * onDeleteMoment(id)
 */
export default function DayMomentsModal({
  date,
  items,
  onClose,
  onUpdateMoment,
  onDeleteMoment,
}) {
  // local editable state theo momentId
  const [drafts, setDrafts] = useState({});

  useEffect(() => {
    // init drafts khi mở
    const obj = {};
    items.forEach((m) => {
      obj[m.id] = { description: m.description ?? "", files: null };
    });
    setDrafts(obj);
  }, [items]);

  const handleChange = (id, changes) => {
    setDrafts((d) => ({ ...d, [id]: { ...d[id], ...changes } }));
  };

  const handleSave = async (m) => {
    const d = drafts[m.id] || {};
    await onUpdateMoment?.(m.id, {
      description: d.description,
      images: d.files ?? undefined, // backend của bạn quyết định nhận FileList hay upload trước
    });
  };

  const handleDelete = async (m) => {
    if (confirm("Delete this moment?")) {
      await onDeleteMoment?.(m.id);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      aria-modal
      role="dialog"
      onClick={onClose}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* panel */}
      <div
        className="relative w-[min(1000px,95vw)] max-h-[85vh] overflow-auto rounded-2xl bg-white shadow-xl border border-black/10 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b">
          <div>
            <div className="text-xs uppercase text-gray-500">Moments on</div>
            <div className="text-lg font-semibold">
              {format(date, "EEEE, dd MMM yyyy")}
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-9 px-3 rounded-lg border hover:bg-black/5"
          >
            Close
          </button>
        </div>

        {/* body */}
        {items.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No moments yet for this day.
          </div>
        ) : (
          <ul className="mt-4 space-y-6">
            {items.map((m) => {
              const d = drafts[m.id] || {};
              return (
                <li
                  key={m.id}
                  className="rounded-xl border bg-gray-50/60 p-4 hover:border-black/10"
                >
                  <div className="grid grid-cols-1 md:grid-cols-[1fr,280px] gap-4">
                    {/* left: description + controls */}
                    <div>
                      <div className="text-sm font-semibold mb-1">
                        Moment #{m.id}
                      </div>
                      <textarea
                        value={d.description ?? ""}
                        onChange={(e) =>
                          handleChange(m.id, { description: e.target.value })
                        }
                        rows={3}
                        placeholder="Description…"
                        className="w-full resize-y rounded-lg border p-2 outline-none focus:ring-2 focus:ring-teal-300/60"
                      />

                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => handleSave(m)}
                          className="h-9 px-3 rounded-lg bg-teal-500 text-white hover:bg-teal-600"
                        >
                          Save changes
                        </button>
                        <button
                          onClick={() => handleDelete(m)}
                          className="h-9 px-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>

                        <label className="ml-auto inline-flex items-center gap-2 text-sm hover:opacity-80 cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) =>
                              handleChange(m.id, { files: e.target.files })
                            }
                            className="hidden"
                          />
                          <span className="h-8 px-3 rounded-lg border bg-white">
                            Add/Replace images
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* right: images */}
                    <div className="rounded-lg bg-white p-2 border">
                      <div className="text-xs text-gray-500 mb-2">
                        Images ({m.images?.length || 0})
                      </div>
                      {m.images?.length ? (
                        <div className="grid grid-cols-3 gap-2">
                          {m.images.map((src, i) => (
                            <img
                              key={i}
                              src={src}
                              alt=""
                              className="h-24 w-full object-cover rounded-md border"
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="h-24 grid place-items-center text-gray-400 text-sm">
                          No image
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

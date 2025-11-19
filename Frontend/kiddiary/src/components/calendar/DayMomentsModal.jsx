import { format } from "date-fns";
import { useEffect, useState } from "react";

export default function DayMomentsModal({ date, items, onClose }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    console.log("items from DB: ", items);
    setList(items || []);
  }, [items]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      aria-modal
      role="dialog"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      <div
        className="relative w-[min(1000px,95vw)] max-h-[85vh] overflow-auto rounded-2xl bg-white shadow-xl border border-black/10 p-5"
        onClick={(e) => e.stopPropagation()}
      >
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

        {list.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No moments yet for this day.
          </div>
        ) : (
          <ul className="mt-4 space-y-6">
            {list.map((m) => (
              <li
                key={m.id}
                className="rounded-xl border bg-gray-50/60 p-4 hover:border-black/10"
              >
                <div className="grid grid-cols-1 md:grid-cols-[1.1fr,0.9fr] gap-4">
                  {/* left: description */}
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-700">
                      Moment #{m.id}
                    </div>
                    {m.caption ? (
                      <p className="text-sm leading-relaxed text-gray-900 whitespace-pre-line">
                        {m.caption  }
                      </p>
                    ) : (
                      <p className="text-sm italic text-gray-400">
                        No description
                      </p>
                    )}
                  </div>

                  <div className="rounded-lg bg-white p-2 border">
                    <div className="text-xs text-gray-500 mb-2">
                      Images ({m.images?.length || 0})
                    </div>
                    {m.images?.length ? (
                      <div className="">
                        {m.images.map((src, i) => (
                          <div
                            key={i}
                            className="relative w-full overflow-hidden rounded-md border bg-gray-50"
                          >
                            <img
                              src={src}
                              alt=""
                              className="h-28 w-full object-cover hover:scale-[1.03] transition-transform duration-200"
                            />
                          </div>
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
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

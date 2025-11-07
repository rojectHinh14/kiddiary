import { useState } from "react";
import { format } from "date-fns";

/**
 * Modal hiển thị kết quả search
 * Props:
 * - query: string - Từ khóa search
 * - results: array - Danh sách kết quả
 * - totalResults: number
 * - onClose: function
 */
export default function SearchModal({ query, results, totalResults, onClose }) {
  const [showAll, setShowAll] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  // Hiển thị 10 kết quả đầu, có nút "Xem thêm" nếu > 10
  const displayResults = showAll ? results : results.slice(0, 10);
  const hasMore = results.length > 10;

  if (!results) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center"
      aria-modal
      role="dialog"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Main Panel */}
      <div
        className="relative w-[min(900px,95vw)] max-h-[85vh] overflow-auto rounded-2xl bg-white shadow-2xl border border-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Search results for</div>
            <div className="text-xl font-semibold text-gray-800">"{query}"</div>
            <div className="text-xs text-gray-400 mt-1">
              Found {totalResults} result{totalResults !== 1 ? "s" : ""}
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-10 px-4 rounded-lg border hover:bg-gray-50 transition"
          >
            Close
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {totalResults === 0 ? (
            <div className="py-16 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <div className="text-lg text-gray-600">No results found</div>
              <div className="text-sm text-gray-400 mt-2">
                Try different keywords or date ranges
              </div>
            </div>
          ) : (
            <>
              {/* Results List */}
              <div className="space-y-3">
                {displayResults.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="group flex gap-4 p-4 rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-md transition cursor-pointer bg-white"
                    onClick={() => setSelectedMedia(item)}
                  >
                    {/* Thumbnail */}
                    <div className="shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                      {item.fileUrl ? (
                        <img
                          src={"http://localhost:8080"+item.fileUrl}
                          alt={item.description || "Media"}
                          className="w-full h-full object-cover"
                        />
                      ) : item.Media?.[0]?.fileUrl ? (
                        <img
                          src={item.Media[0].fileUrl}
                          alt={item.albumName || "Album"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          📷
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          {/* Title/Description */}
                          <div className="font-medium text-gray-800 line-clamp-1">
                            {item.albumName || item.description || "Untitled"}
                          </div>

                          {/* Description for media */}
                          {item.description && (
                            <div className="text-sm text-gray-600 line-clamp-2 mt-1">
                              {item.description}
                            </div>
                          )}

                          {/* Tags if available */}
                          {item.aiTags && Array.isArray(item.aiTags) && item.aiTags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.aiTags.slice(0, 3).map((tag, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 text-xs rounded-full bg-teal-50 text-teal-700"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Date */}
                          {item.date && (
                            <div className="text-xs text-gray-400 mt-2">
                              📅 {format(new Date(item.date), "dd MMM yyyy")}
                            </div>
                          )}

                          {/* Album info */}
                          {item.Media && (
                            <div className="text-xs text-gray-400 mt-2">
                              📁 {item.Media.length} photo{item.Media.length !== 1 ? "s" : ""}
                            </div>
                          )}
                        </div>

                        {/* Type badge */}
                        <span className="shrink-0 px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-600">
                          {item.albumName ? "Album" : "Photo"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show More Button */}
              {hasMore && !showAll && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowAll(true)}
                    className="px-6 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition"
                  >
                    Show all {totalResults} results
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Media Detail Modal (nested) */}
      {selectedMedia && (
        <MediaDetailModal
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </div>
  );
}

/**
 * Modal chi tiết 1 media (nested modal)
 */
function MediaDetailModal({ media, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <div
        className="relative w-[min(700px,90vw)] max-h-[90vh] overflow-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-lg font-semibold">Media Details</h3>
          <button
            onClick={onClose}
            className="h-9 px-3 rounded-lg border hover:bg-gray-50"
          >
            Close
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image */}
          {media.fileUrl && (
            <div className="mb-6 rounded-xl overflow-hidden bg-gray-100">
              <img
                src={"http://localhost:8080" + media.fileUrl}
                alt={media.description || "Media"}
                className="w-full h-auto max-h-[400px] object-contain"
              />
            </div>
          )}

          {/* Info */}
          <div className="space-y-4">
            {/* Description */}
            {media.description && (
              <div>
                <div className="text-sm font-semibold text-gray-500 mb-1">Description</div>
                <div className="text-gray-800">{media.description}</div>
              </div>
            )}

            {/* Date */}
            {media.date && (
              <div>
                <div className="text-sm font-semibold text-gray-500 mb-1">Date</div>
                <div className="text-gray-800">
                  {format(new Date(media.date), "EEEE, dd MMMM yyyy")}
                </div>
              </div>
            )}

            {/* Tags */}
            {media.aiTags && Array.isArray(media.aiTags) && media.aiTags.length > 0 && (
              <div>
                <div className="text-sm font-semibold text-gray-500 mb-2">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {media.aiTags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-sm rounded-full bg-teal-50 text-teal-700 border border-teal-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* File URL */}
            <div>
              <div className="text-sm font-semibold text-gray-500 mb-1">File URL</div>
              <a
                href={media.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:underline text-sm break-all"
              >
                {media.fileUrl}
              </a>
            </div>

            {/* Album Info (if from album) */}
            {media.Media && (
              <div>
                <div className="text-sm font-semibold text-gray-500 mb-2">
                  Album: {media.albumName}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {media.Media.slice(0, 8).map((img, i) => (
                    <img
                      key={i}
                      src={img.fileUrl}
                      alt=""
                      className="w-full h-20 object-cover rounded-lg border"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
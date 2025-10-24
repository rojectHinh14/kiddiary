export default function AlbumCard({ album, onOpen, onAddToAlbum }) {
  return (
    <div className="group cursor-pointer" onClick={onOpen}>
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-black/5">
        <img
          src={album.coverUrl}
          alt={album.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="font-medium">{album.title}</div>
        <div className="text-sm text-gray-500">
          {album.photos.length} photos
        </div>
      </div>
      {/* Button Add moments */}
      {onAddToAlbum && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Ngăn click card
            onAddToAlbum();
          }}
          className="mt-2 w-full px-3 py-1 text-xs bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-md hover:bg-[#FF6B6B]/20 transition-colors"
        >
          Add moments to album
        </button>
      )}
    </div>
  );
}

// AlbumCard.jsx
export default function AlbumCard({ album, onOpen }) {
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
        <div className="text-sm text-gray-500">{album.photos.length} photos</div>
      </div>
    </div>
  );
}

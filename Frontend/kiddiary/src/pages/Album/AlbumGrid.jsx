import { useNavigate } from "react-router-dom";
import AlbumCard from "./AlbumCard";

export default function AlbumGrid({ albums, onAddClick }) {
  const navigate = useNavigate();

  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
      {albums.map((a) => (
        <AlbumCard
          key={a.id}
          album={a}
          onOpen={() => navigate(`/albums/${a.id}`)}  // 👈 chuyển route
        />
      ))}

      <button
        onClick={onAddClick}
        className="aspect-[4/3] rounded-2xl border border-dashed bg-gray-50 hover:bg-gray-100
                   flex flex-col items-center justify-center gap-3"
      >
        <div className="text-3xl">＋</div>
        <div className="text-gray-600">Add new album</div>
      </button>
    </div>
  );
}

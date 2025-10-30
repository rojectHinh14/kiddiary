export default function ChildCard({ child }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-40 h-40 rounded-full border flex items-center justify-center overflow-hidden bg-white">
        {child.avatarUrl ? (
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}${child.avatarUrl}`}
            alt={child.firstName}
            className="object-cover w-full h-full"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-16 h-16 text-gray-500"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
          </svg>
        )}
      </div>
      <p className="mt-2 text-sm font-medium">{child.firstName}</p>
    </div>
  );
}

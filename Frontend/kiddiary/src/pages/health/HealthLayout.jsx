import { Outlet } from "react-router-dom";

export default function HealthLayout() {
  return (
    <div className="px-4 md:px-5 lg:px-6 py-4 bg-white ">
      <div className="mx-auto w-full max-w-[1200px] rounded-lg">
        <Outlet /> {/* Overview / Vaccination / Sleep */}
      </div>
    </div>
  );
}

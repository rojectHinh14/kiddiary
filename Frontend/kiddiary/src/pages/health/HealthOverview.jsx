import BabyOverviewPanel from "./BabyOverviewPanel";
import { useNavigate } from "react-router-dom";

export default function HealthOverview() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto w-full max-w-[1120px]">
      <BabyOverviewPanel
        onOpenVaccination={() => navigate("/home/health/vaccination")}
        onOpenSleep={() => navigate("/home/health/sleep")}
      />
    </div>
  );
}

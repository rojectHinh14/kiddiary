// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import HomeLayout from "./pages/home/HomeLayout";
import AuthPage from "./pages/AuthPage";

import MomentsPage from "./pages/home/MomentPage";
import CalendarPage from "./pages/calendar/CalendarPage";
import AlbumPanel from "./pages/Album/AlbumPanel";
import AlbumDetail from "./pages/Album/AlbumDetail";
import ChildrenPanel from "./pages/child/ChildrenPanel";

import HealthOverview from "./pages/health/HealthOverview";
import VaccinationSchedulePage from "./pages/health/VaccinationSchedulePage";
import SleepTrackerPage from "./pages/health/SleepTrackerPage";
import SleepAddPage from "./pages/health/SleepAddPage";

import Profile from "./pages/profile/Profile";
import SleepHistoryPage from "./pages/health/SleepHistoryPage";
import GrowthPage from "./pages/health/bmi/GrowthPage";
import GrowthAddPage from "./pages/health/bmi/GrowthAddPage";
import WhoStandardPage from "./pages/health/bmi/WhoStandardPage";
import VaccinationSummaryPage from "./pages/health/VaccinationSummaryPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<AuthPage />} />

        {/* TẤT CẢ trang dùng chung layout */}
        <Route path="/home" element={<HomeLayout />}>
          {/* /home */}
          <Route index element={<MomentsPage />} />
          {/* /home/calendar */}
          <Route path="calendar" element={<CalendarPage />} />
          {/* /home/album, /home/album/:id */}
          <Route path="album" element={<AlbumPanel />} />
          <Route path="album/:id" element={<AlbumDetail />} />
          {/* /home/children */}
          <Route path="children" element={<ChildrenPanel />} />

          {/* /home/health/... */}
          <Route path="health">
            <Route index element={<HealthOverview />} />
            <Route path="vaccination" element={<VaccinationSchedulePage />} />
            <Route path="vaccination/summary" element={<VaccinationSummaryPage />} />
            <Route path="sleep" element={<SleepTrackerPage />} />
            <Route path="sleep/new" element={<SleepAddPage />} />
            <Route path="sleep/history" element={<SleepHistoryPage />} />
            <Route path="growth" element={<GrowthPage />} />
            <Route path="growth/new" element={<GrowthAddPage />} />
            <Route path="/home/health/growth/who-standard" element={<WhoStandardPage />} />
          </Route>

          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Redirect mọi thứ khác về /home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

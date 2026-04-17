import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import AppShell from "../../layout/AppShell";
import IssuesPage from "./IssuesPage";
import FeedbackPage from "./FeedbackPage";
import { getMyIssues } from "../../api/issueApi";

const CollegiateDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({ total: 0, open: 0, resolved: 0 });

  const fetchStats = useCallback(async () => {
    try {
      const issues = await getMyIssues();
      setStats({
        total: issues.length,
        open: issues.filter((i) => i.status === "Open").length,
        resolved: issues.filter((i) => i.status === "Resolved").length,
      });
    } catch (err) {
      console.error("Hiba a statisztikák betöltésekor:", err);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const isActive = (path) => location.pathname.includes(path);

  return (
    <AppShell
      title="Kollégista felület"
      subtitle="Kezeld a hibabejelentéseidet és visszajelzéseidet"
      brandTitle="Kollégista felület"
      brandSubtitle="Hibabejelentések és visszajelzések kezelése."
    >
      {/* Statisztika kártyák */}
      <div className="row g-3 mb-4">
        <div className="col-4">
          <div className="card border-0 shadow-sm text-center p-3">
            <div className="text-muted" style={{ fontSize: 13 }}>
              Összes bejelentés
            </div>
            <div className="fw-semibold" style={{ fontSize: 28 }}>
              {stats.total}
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card border-0 shadow-sm text-center p-3">
            <div className="text-muted" style={{ fontSize: 13 }}>
              Nyitott hibák
            </div>
            <div className="fw-semibold text-warning" style={{ fontSize: 28 }}>
              {stats.open}
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card border-0 shadow-sm text-center p-3">
            <div className="text-muted" style={{ fontSize: 13 }}>
              Javított hibák
            </div>
            <div className="fw-semibold text-success" style={{ fontSize: 28 }}>
              {stats.resolved}
            </div>
          </div>
        </div>
      </div>

      {/* Tabok */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${isActive("issues") ? "active" : ""}`}
            onClick={() => navigate("/collegiate/issues")}
          >
            Hibáim
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${isActive("feedbacks") ? "active" : ""}`}
            onClick={() => navigate("/collegiate/feedbacks")}
          >
            Visszajelzéseim
          </button>
        </li>
      </ul>

      {/* Aloldalak */}
      <Routes>
        <Route
          path="issues"
          element={<IssuesPage onStatsRefresh={fetchStats} />}
        />
        <Route path="feedbacks" element={<FeedbackPage />} />
        <Route path="*" element={<IssuesPage onStatsRefresh={fetchStats} />} />
      </Routes>
    </AppShell>
  );
};

export default CollegiateDashboard;

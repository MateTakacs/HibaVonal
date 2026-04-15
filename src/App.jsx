import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import { ROLES } from "./constants/roles";
import { APP_ROUTES } from "./constants/routes";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForbiddenPage from "./pages/auth/ForbiddenPage";
import LeadMaintainerDashboardPage from "./pages/leadMaintainer/LeadMaintainerDashboardPage";
import MaintainerDashboardPage from "./pages/maintainer/MaintainerDashboardPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicOnlyRoute from "./routes/PublicOnlyRoute";
import RoleHomeRedirect from "./routes/RoleHomeRedirect";

function AppRoutes() {
  return (
    <Routes>
      <Route path={APP_ROUTES.ROOT} element={<RoleHomeRedirect />} />
      <Route
        path={APP_ROUTES.LOGIN}
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path={APP_ROUTES.REGISTER}
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />
      <Route path={APP_ROUTES.FORBIDDEN} element={<ForbiddenPage />} />
      <Route
        path={APP_ROUTES.MAINTAINER}
        element={
          <ProtectedRoute allowedRoles={[ROLES.MAINTAINER]}>
            <MaintainerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path={APP_ROUTES.LEAD_MAINTAINER}
        element={
          <ProtectedRoute allowedRoles={[ROLES.LEAD_MAINTAINER]}>
            <LeadMaintainerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={APP_ROUTES.ROOT} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={2500} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

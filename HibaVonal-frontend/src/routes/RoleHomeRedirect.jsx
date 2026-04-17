import { Navigate } from "react-router-dom";
import { APP_ROUTES } from "../constants/routes";
import { useAuth } from "../context/AuthContext";
import { getHomeRouteForRole } from "../utils/navigation";

const RoleHomeRedirect = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to={APP_ROUTES.LOGIN} replace />;
  return <Navigate to={getHomeRouteForRole(user?.role)} replace />;
};

export default RoleHomeRedirect;

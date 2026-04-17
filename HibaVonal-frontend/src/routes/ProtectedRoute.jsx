import { Navigate, useLocation } from "react-router-dom";
import { APP_ROUTES } from "../constants/routes";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate to={APP_ROUTES.LOGIN} replace state={{ from: location }} />
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to={APP_ROUTES.FORBIDDEN} replace />;
  }

  return children;
};

export default ProtectedRoute;

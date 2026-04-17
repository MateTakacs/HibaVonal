import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { APP_ROUTES } from "../constants/routes";
import { ROLES, getRoleLabel } from "../constants/roles";
import { useAuth } from "../context/AuthContext";

const AppShell = ({ title, subtitle, children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(APP_ROUTES.LOGIN, { replace: true });
    toast.success("Sikeres kijelentkezés.");
  };

  return (
    <div className="app-shell container-fluid">
      <div className="row min-vh-100">
        <aside className="col-12 col-lg-3 col-xl-2 app-sidebar">
          <div className="sidebar-content">
            <div>
              <span className="eyebrow">HibaVonal</span>
              <h1 className="sidebar-title">Karbantartási felület</h1>
              <p className="sidebar-subtitle">
                Hibajegyek, kiosztások és eszközrendelések kezelése a meglévő backenddel.
              </p>
            </div>

            <div className="user-card">
              <div className="user-avatar">{user?.name?.slice(0, 1) || "U"}</div>
              <div>
                <div className="fw-semibold">{user?.name}</div>
                <div className="small text-secondary">{user?.email}</div>
                <div className="small text-primary">{getRoleLabel(user?.role)}</div>
              </div>
            </div>

            <div className="small text-white-50">
              {user?.role === ROLES.MAINTAINER ? "Maintainer dashboard" : "Lead maintainer dashboard"}
            </div>

            <button type="button" className="btn btn-outline-danger mt-auto" onClick={handleLogout}>
              Kijelentkezés
            </button>
          </div>
        </aside>

        <main className="col-12 col-lg-9 col-xl-10 app-main">
          <div className="page-header">
            <span className="eyebrow">Műveleti központ</span>
            <h2 className="page-title">{title}</h2>
            {subtitle ? <p className="page-subtitle">{subtitle}</p> : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../api/authApi";
import { APP_ROUTES } from "../../constants/routes";
import { useAuth } from "../../context/AuthContext";
import { getSafePostLoginRoute } from "../../utils/navigation";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const fillDemo = (username) => {
    setFormData({ username, password: "jelszo123" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(formData);
      login(response.user, response.token);
      toast.success("Sikeres bejelentkezés.");

      const requestedPath = location.state?.from?.pathname;
      const redirectTarget = getSafePostLoginRoute(response.user.role, requestedPath);

      navigate(redirectTarget || APP_ROUTES.ROOT, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || "Hibás felhasználónév vagy jelszó.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          Felhasználónév / Neptun-kód
        </label>
        <input
          id="username"
          name="username"
          type="text"
          className="form-control"
          value={formData.username}
          onChange={handleChange}
          placeholder="Pl. maintainer1"
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Jelszó
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="form-control"
          value={formData.password}
          onChange={handleChange}
          placeholder="Add meg a jelszavad"
          required
        />
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => fillDemo("maintainer1")}>
          Maintainer demo
        </button>
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => fillDemo("leadmaintainer1")}>
          Lead maintainer demo
        </button>
      </div>

      {error ? (
        <div className="alert alert-danger py-2" role="alert">
          {error}
        </div>
      ) : null}

      <button type="submit" className="btn btn-primary w-100" disabled={loading}>
        {loading ? "Bejelentkezés..." : "Bejelentkezés"}
      </button>

      <p className="text-center mt-4 mb-0">
        Még nincs fiókod?{" "}
        <Link to={APP_ROUTES.REGISTER} className="text-decoration-none">
          Regisztráció
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;

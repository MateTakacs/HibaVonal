import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(formData);
      login(response.user, response.token);
      toast.success("Sikeres bejelentkezés!");
      navigate("/");
    } catch (err) {
      const message =
        err.response?.data?.message || "Hibás felhasználónév vagy jelszó.";
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
          Neptun-kód
        </label>
        <input
          id="username"
          name="username"
          type="text"
          className="form-control"
          value={formData.username}
          onChange={handleChange}
          placeholder="Add meg a Neptun-kódodat"
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
          placeholder="Add meg a jelszavadat"
          required
        />
      </div>
      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}
        </div>
      )}
      <button
        type="submit"
        className="btn btn-primary w-100 mb-3"
        disabled={loading}
      >
        {loading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
            />
            Bejelentkezés...
          </>
        ) : (
          "Bejelentkezés"
        )}
      </button>
      <p className="text-center mb-0">
        Még nincs fiókod?{" "}
        <Link to="/register" className="text-decoration-none">
          Regisztráció
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../../api/authApi";
import { APP_ROUTES } from "../../constants/routes";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    neptunCode: "",
    password: "",
    confirmPassword: "",
    name: "",
    email: "",
    roomNum: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("A két jelszó nem egyezik.");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        neptunCode: formData.neptunCode,
        password: formData.password,
        name: formData.name,
        email: formData.email,
        roomNum: formData.roomNum ? Number(formData.roomNum) : null,
      });

      toast.success("Sikeres regisztráció. Most már bejelentkezhetsz.");
      navigate(APP_ROUTES.LOGIN);
    } catch (err) {
      const message =
        err.response?.data?.message || "A regisztráció sikertelen.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="neptunCode" className="form-label">
            Neptun-kód
          </label>
          <input
            id="neptunCode"
            name="neptunCode"
            className="form-control"
            value={formData.neptunCode}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="roomNum" className="form-label">
            Szobaszám
          </label>
          <input
            id="roomNum"
            name="roomNum"
            type="number"
            className="form-control"
            value={formData.roomNum}
            onChange={handleChange}
            placeholder="Opcionális"
          />
        </div>
        <div className="col-12">
          <label htmlFor="name" className="form-label">
            Teljes név
          </label>
          <input
            id="name"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-12">
          <label htmlFor="email" className="form-label">
            Email cím
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
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
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="confirmPassword" className="form-label">
            Jelszó újra
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="form-control"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {error ? (
        <div className="alert alert-danger py-2 mt-3" role="alert">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        className="btn btn-primary w-100 mt-4"
        disabled={loading}
      >
        {loading ? "Regisztráció..." : "Regisztráció"}
      </button>

      <p className="text-center mt-4 mb-0">
        Már van fiókod?{" "}
        <Link to={APP_ROUTES.LOGIN} className="text-decoration-none">
          Bejelentkezés
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;

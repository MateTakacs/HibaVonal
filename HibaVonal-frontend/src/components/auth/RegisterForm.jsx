import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../../api/authApi";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("A két jelszó nem egyezik meg.");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        neptunCode: formData.neptunCode,
        password: formData.password,
        name: formData.name,
        email: formData.email,
        roomNum: formData.roomNum ? parseInt(formData.roomNum) : null,
      });
      toast.success("Sikeres regisztráció! Jelentkezz be.");
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.message || "Sikertelen regisztráció.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="neptunCode" className="form-label">
          Neptun-kód
        </label>
        <input
          id="neptunCode"
          name="neptunCode"
          type="text"
          className="form-control"
          value={formData.neptunCode}
          onChange={handleChange}
          placeholder="Add meg a Neptun-kódodat"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Teljes név
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="form-control"
          value={formData.name}
          onChange={handleChange}
          placeholder="Add meg a teljes nevedet"
          required
        />
      </div>
      <div className="mb-3">
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
          placeholder="Add meg az email címedet"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="roomNum" className="form-label">
          Szobaszám <span className="text-muted">(opcionális)</span>
        </label>
        <input
          id="roomNum"
          name="roomNum"
          type="number"
          className="form-control"
          value={formData.roomNum}
          onChange={handleChange}
          placeholder="Add meg a szobaszámodat"
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
          placeholder="Válassz egy jelszót"
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="confirmPassword" className="form-label">
          Jelszó megerősítése
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className="form-control"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Írd be újra a jelszót"
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
            Regisztráció...
          </>
        ) : (
          "Regisztráció"
        )}
      </button>
      <p className="text-center mb-0">
        Már van fiókod?{" "}
        <Link to="/login" className="text-decoration-none">
          Bejelentkezés
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;

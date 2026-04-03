import RegisterForm from "../../components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="card shadow-sm my-4"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <div className="card-body p-4">
          <h2 className="card-title text-center mb-1">HibaVonal</h2>
          <p className="text-center text-muted mb-4">Regisztráció</p>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

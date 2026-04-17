import RegisterForm from "../../components/auth/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="auth-page container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7 col-xl-6">
          <div className="card border-0 shadow-lg auth-card">
            <div className="card-body p-4 p-md-5">
              <div className="mb-4 text-center">
                <span className="eyebrow">Új felhasználó</span>
                <h1 className="auth-title smaller">Regisztráció</h1>
                <p className="auth-text mb-0">
                  A backend whitelist alapú regisztrációt használ, ezért csak
                  engedélyezett Neptun-kóddal lehet új fiókot létrehozni.
                </p>
              </div>
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

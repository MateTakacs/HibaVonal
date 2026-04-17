import heroImage from "../../assets/hero.png";
import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="auth-page container py-5">
      <div className="row align-items-center justify-content-center g-4">
        <div className="col-lg-6">
          <div className="auth-copy">
            <span className="eyebrow">HibaVonal</span>
            <h1 className="auth-title">Bejelentkezés a karbantartási rendszerbe</h1>
            <p className="auth-text">
              A generált frontend a meglévő .NET backend API-kat használja, és különösen a maintainer
              valamint lead maintainer felületeket dolgozza ki részletesen.
            </p>
            <div className="demo-credentials">
              <div className="fw-semibold mb-2">Seedelt tesztfiókok</div>
              <ul className="mb-0">
                <li>maintainer1 / jelszo123</li>
                <li>leadmaintainer1 / jelszo123</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card border-0 shadow-lg auth-card">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <img src={heroImage} alt="HibaVonal" className="auth-hero-image" />
              </div>
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

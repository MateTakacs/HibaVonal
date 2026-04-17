import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../constants/routes";

const ForbiddenPage = () => (
  <div className="container py-5">
    <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: 720 }}>
      <div className="card-body p-5 text-center">
        <span className="eyebrow">403</span>
        <h1 className="h3 mb-3">Ehhez az oldalhoz nincs jogosultságod</h1>
        <p className="text-secondary mb-4">
          Ez a frontend főleg a maintainer és lead maintainer szerepkörökhöz
          készült.
        </p>
        <Link to={APP_ROUTES.ROOT} className="btn btn-primary">
          Vissza a kezdőlapra
        </Link>
      </div>
    </div>
  </div>
);

export default ForbiddenPage;

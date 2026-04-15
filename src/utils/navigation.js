import { APP_ROUTES } from "../constants/routes";
import { ROLES } from "../constants/roles";

export const getHomeRouteForRole = (role) => {
  if (role === ROLES.MAINTAINER) return APP_ROUTES.MAINTAINER;
  if (role === ROLES.LEAD_MAINTAINER) return APP_ROUTES.LEAD_MAINTAINER;
  return APP_ROUTES.FORBIDDEN;
};

export const canRoleAccessPath = (role, pathName) => {
  if (!pathName) return false;
  if (pathName === APP_ROUTES.ROOT) return true;
  if (role === ROLES.MAINTAINER) return pathName.startsWith(APP_ROUTES.MAINTAINER);
  if (role === ROLES.LEAD_MAINTAINER) return pathName.startsWith(APP_ROUTES.LEAD_MAINTAINER);
  return false;
};

export const getSafePostLoginRoute = (role, requestedPathName) => {
  if (canRoleAccessPath(role, requestedPathName)) {
    return requestedPathName;
  }

  return getHomeRouteForRole(role);
};

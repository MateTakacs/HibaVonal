export const ROLES = {
  USER: "User",
  MAINTAINER: "Maintainer",
  LEAD_MAINTAINER: "Lead_Maintainer",
  ADMIN: "Admin",
};

export const ROLE_LABELS = {
  [ROLES.USER]: "Kollégista",
  [ROLES.MAINTAINER]: "Karbantartó",
  [ROLES.LEAD_MAINTAINER]: "Vezető karbantartó",
  [ROLES.ADMIN]: "Adminisztrátor",
};

export const getRoleLabel = (role) => ROLE_LABELS[role] || role || "Ismeretlen szerepkör";

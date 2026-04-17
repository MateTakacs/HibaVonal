const joinValidationErrors = (errors) => {
  if (!errors || typeof errors !== "object") return null;

  const messages = Object.values(errors)
    .flat()
    .filter(Boolean);

  return messages.length > 0 ? messages.join(" ") : null;
};

export const createApiErrorMessage = (error, fallback) => {
  const responseData = error?.response?.data;
  const responseStatus = error?.response?.status;

  if (responseStatus === 401) {
    return "A munkamenet lejárt. Jelentkezz be újra.";
  }

  if (responseStatus === 403) {
    return "Nincs jogosultságod ehhez a művelethez.";
  }

  if (error?.code === "ECONNABORTED") {
    return "A kérés időtúllépés miatt megszakadt. Ellenőrizd, hogy a backend elindult-e.";
  }

  if (error?.message === "Network Error") {
    return "A backend API nem érhető el. Ellenőrizd, hogy fut-e a szerver és helyes-e a VITE_API_BASE_URL értéke.";
  }

  if (!responseData) return fallback;
  if (typeof responseData === "string") return responseData;
  if (responseData.message) return responseData.message;

  const validationMessage = joinValidationErrors(responseData.errors);
  return validationMessage || fallback;
};

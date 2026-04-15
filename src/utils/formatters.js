export const formatDateTime = (value) => {
  if (!value) return "—";

  return new Intl.DateTimeFormat("hu-HU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

export const formatDateInputValue = (value) => {
  const date = value ? new Date(value) : new Date(Date.now() + 24 * 60 * 60 * 1000);
  const timeZoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - timeZoneOffset).toISOString().slice(0, 16);
};

export const formatCurrency = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
  return `${Number(value).toLocaleString("hu-HU")} Ft`;
};

const VARIANTS = {
  Open: "text-bg-danger",
  InProgress: "text-bg-warning",
  Resolved: "text-bg-success",
  Closed: "text-bg-secondary",
  Pending: "text-bg-warning",
  Completed: "text-bg-success",
  Cancelled: "text-bg-danger",
};

const LABELS = {
  Open: "Nyitott",
  InProgress: "Folyamatban",
  Resolved: "Megoldva",
  Closed: "Lezárt",
  Pending: "Függőben",
  Completed: "Teljesítve",
  Cancelled: "Törölve",
  High: "Magas",
  Medium: "Közepes",
  Low: "Alacsony",
};

const StatusBadge = ({ value }) => {
  return <span className={`badge ${VARIANTS[value] || "text-bg-light"}`}>{LABELS[value] || value}</span>;
};

export default StatusBadge;

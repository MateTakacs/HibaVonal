export const ISSUE_STATUS_OPTIONS = [
  { value: "Open", label: "Nyitott", apiValue: 0 },
  { value: "InProgress", label: "Folyamatban", apiValue: 1 },
  { value: "Resolved", label: "Megoldva", apiValue: 2 },
  { value: "Closed", label: "Lezárt", apiValue: 3 },
];

export const ORDER_STATUS_OPTIONS = [
  { value: "Pending", label: "Függőben", apiValue: 0 },
  { value: "InProgress", label: "Folyamatban", apiValue: 1 },
  { value: "Completed", label: "Teljesítve", apiValue: 2 },
  { value: "Cancelled", label: "Törölve", apiValue: 3 },
];

export const URGENCY_OPTIONS = [
  { value: "High", label: "Magas" },
  { value: "Medium", label: "Közepes" },
  { value: "Low", label: "Alacsony" },
];

export const MAINTAINER_ALLOWED_ISSUE_STATUSES = ["InProgress", "Resolved"];

const createApiMap = (items) =>
  items.reduce((accumulator, item) => {
    accumulator[item.value] = item.apiValue;
    return accumulator;
  }, {});

export const ISSUE_STATUS_API_MAP = createApiMap(ISSUE_STATUS_OPTIONS);
export const ORDER_STATUS_API_MAP = createApiMap(ORDER_STATUS_OPTIONS);

export const getIssueStatusApiValue = (status) => ISSUE_STATUS_API_MAP[status];
export const getOrderStatusApiValue = (status) => ORDER_STATUS_API_MAP[status];

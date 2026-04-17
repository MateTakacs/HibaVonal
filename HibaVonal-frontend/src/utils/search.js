export const getIssueSearchText = (issue) =>
  [
    issue.id,
    issue.description,
    issue.status,
    issue.urgency,
    issue.roomNumber,
    issue.equipmentName,
    issue.reporterName,
    issue.assignedMaintainerName,
    issue.assignedMaintainerEmail,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const getOrderSearchText = (order) =>
  [order.id, order.status, order.toolMaker, order.toolModel, order.toolPrice]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

export const filterBySearch = (items, searchText, getText) => {
  const normalizedSearch = searchText.trim().toLowerCase();

  if (!normalizedSearch) return items;
  return items.filter((item) => getText(item).includes(normalizedSearch));
};

export const groupCountBy = (items, field) =>
  items.reduce((accumulator, item) => {
    const key = item?.[field] || "Unknown";
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});

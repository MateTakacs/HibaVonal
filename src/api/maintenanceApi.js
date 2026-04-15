import { getIssueStatusApiValue, getOrderStatusApiValue } from "../constants/statuses";
import api from "./axiosConfig";

const inFlightGetRequests = new Map();

const createRequestKey = (url, params) => `${url}::${JSON.stringify(params || {})}`;

const getWithDeduplication = async (url, params) => {
  const requestKey = createRequestKey(url, params);

  if (inFlightGetRequests.has(requestKey)) {
    return inFlightGetRequests.get(requestKey);
  }

  const requestPromise = api
    .get(url, { params })
    .then((response) => response.data)
    .finally(() => {
      inFlightGetRequests.delete(requestKey);
    });

  inFlightGetRequests.set(requestKey, requestPromise);
  return requestPromise;
};

const buildParams = (params) => {
  const normalized = {};

  Object.entries(params || {}).forEach(([key, value]) => {
    if (typeof value === "boolean") {
      if (value) normalized[key] = value;
      return;
    }

    if (value !== "" && value !== null && value !== undefined) {
      normalized[key] = value;
    }
  });

  return normalized;
};

export const getMaintainerIssues = async ({ status } = {}) => getWithDeduplication("/api/maintainer/issues", buildParams({ status }));

export const getMaintainerIssueById = async (id) => getWithDeduplication(`/api/maintainer/issues/${id}`);

export const updateMaintainerIssueStatus = async (id, status) => {
  const response = await api.patch(`/api/maintainer/issues/${id}/status`, {
    status: getIssueStatusApiValue(status),
  });
  return response.data;
};

export const getMaintainerOrders = async ({ status } = {}) => getWithDeduplication("/api/maintainer/orders", buildParams({ status }));

export const createMaintainerOrder = async (payload) => {
  const response = await api.post("/api/maintainer/orders", payload);
  return response.data;
};

export const getLeadMaintainerIssues = async ({ status, onlyUnassigned } = {}) =>
  getWithDeduplication("/api/lead-maintainer/issues", buildParams({ status, onlyUnassigned }));

export const getLeadMaintainerIssueById = async (id) => getWithDeduplication(`/api/lead-maintainer/issues/${id}`);

export const getMaintainers = async () => getWithDeduplication("/api/lead-maintainer/maintainers");

export const assignIssueToMaintainer = async (id, maintainerId) => {
  const response = await api.patch(`/api/lead-maintainer/issues/${id}/assign`, {
    maintainerId: Number(maintainerId),
  });
  return response.data;
};

export const updateLeadMaintainerIssueStatus = async (id, status) => {
  const response = await api.patch(`/api/lead-maintainer/issues/${id}/status`, {
    status: getIssueStatusApiValue(status),
  });
  return response.data;
};

export const getLeadMaintainerOrders = async ({ status } = {}) =>
  getWithDeduplication("/api/lead-maintainer/orders", buildParams({ status }));

export const createLeadMaintainerOrder = async (payload) => {
  const response = await api.post("/api/lead-maintainer/orders", payload);
  return response.data;
};

export const updateLeadMaintainerOrderStatus = async (id, status) => {
  const response = await api.patch(`/api/lead-maintainer/orders/${id}/status`, {
    status: getOrderStatusApiValue(status),
  });
  return response.data;
};

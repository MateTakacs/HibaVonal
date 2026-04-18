import api from "./axiosConfig";

export const getWhitelist = async () => {
  const response = await api.get("/api/Admin/whitelist");
  return response.data;
};

export const addRegAllow = async (neptunCode) => {
  const response = await api.post("/api/Admin/whitelist", `"${neptunCode}"`, {
    headers: { "Content-Type": "application/json" }
  });
  return response.data;
};

export const getEquipments = async () => {
  const response = await api.get("/api/Admin/equipment");
  return response.data;
};

export const addEquipment = async (equipmentData) => {
  const response = await api.post("/api/Admin/equipment", equipmentData);
  return response.data;
};

export const deleteEquipment = async (id) => {
  const response = await api.delete(`/api/Admin/equipment/${id}`);
  return response.data;
};
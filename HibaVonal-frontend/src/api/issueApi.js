import api from "./axiosConfig";

const getAuthHeader = () => ({
  headers: { Authorization: Bearer ${localStorage.getItem("token")} },
});

export const getMyIssues = async () => {
  const response = await api.get("/api/collegiate/issues", getAuthHeader());
  return response.data;
};

export const createIssue = async (data, file) => {
  const formData = new FormData();
  formData.append("description", data.description);
  formData.append("urgency", data.urgency);
  formData.append("roomNum", data.roomNum);
  if (data.equipmentId) formData.append("equipmentId", data.equipmentId);
  if (file) formData.append("file", file);

  const response = await api.post("/api/collegiate/issue", formData, {
    headers: {
      Authorization: Bearer ${localStorage.getItem("token")},
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateIssue = async (id, data) => {
  const response = await api.put(/api/collegiate/issue/${id}, data, getAuthHeader());
  return response.data;
};

export const getEquipmentsByRoom = async (roomNum) => {
  const response = await api.get(/api/collegiate/rooms/${roomNum}/equipments, getAuthHeader());
  return response.data;
};
import api from "./axiosConfig";

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getMyIssues = async () => {
  const response = await api.get("/api/collegiate/issues", getAuthHeader());
  return response.data;
};

export const createIssue = async (data) => {
  const response = await api.post(
    "/api/collegiate/issue",
    data,
    getAuthHeader(),
  );
  return response.data;
};

export const updateIssue = async (id, data) => {
  const response = await api.put(
    `/api/collegiate/issue/${id}`,
    data,
    getAuthHeader(),
  );
  return response.data;
};

export const getEquipmentsByRoom = async (roomNum) => {
  const response = await api.get(
    `/api/collegiate/rooms/${roomNum}/equipments`,
    getAuthHeader(),
  );
  return response.data;
};

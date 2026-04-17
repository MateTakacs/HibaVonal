import api from "./axiosConfig";

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const getMyFeedbacks = async () => {
  const response = await api.get("/api/collegiate/feedbacks", getAuthHeader());
  return response.data;
};

export const createFeedback = async (data) => {
  const response = await api.post(
    "/api/collegiate/feedback",
    data,
    getAuthHeader(),
  );
  return response.data;
};

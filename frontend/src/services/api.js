import axios from "axios";

const api = axios.create({
  baseURL: "/api"
});

export const studentsApi = {
  list: () => api.get("/students").then((r) => r.data),
  create: (data) => api.post("/students", data).then((r) => r.data),
  update: (id, data) => api.put(`/students/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/students/${id}`).then((r) => r.data)
};

export const roomsApi = {
  list: () => api.get("/rooms").then((r) => r.data),
  create: (data) => api.post("/rooms", data).then((r) => r.data),
  update: (id, data) => api.put(`/rooms/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/rooms/${id}`).then((r) => r.data)
};

export const bedsApi = {
  list: () => api.get("/beds").then((r) => r.data),
  create: (data) => api.post("/beds", data).then((r) => r.data),
  update: (id, data) => api.put(`/beds/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/beds/${id}`).then((r) => r.data)
};

export const attendanceApi = {
  list: (date) => api.get("/attendance", { params: date ? { date } : {} }).then((r) => r.data),
  mark: (data) => api.post("/attendance", data).then((r) => r.data),
  remove: (id) => api.delete(`/attendance/${id}`).then((r) => r.data)
};

export const paymentsApi = {
  list: () => api.get("/payments").then((r) => r.data),
  summary: () => api.get("/payments/summary").then((r) => r.data),
  create: (data) => api.post("/payments", data).then((r) => r.data),
  update: (id, data) => api.put(`/payments/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/payments/${id}`).then((r) => r.data)
};

export default api;

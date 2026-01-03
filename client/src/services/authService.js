import api from "./api.js";
const authApi = {
    register: (data) => api.post("/auth/register", data),
    login: (data) => api.post("/auth/login", data),
};
export default authApi;
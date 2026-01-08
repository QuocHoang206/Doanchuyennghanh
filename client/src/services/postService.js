import api from "./api.js";

const postApi = {
  getProducts: () => api.get("/products"),
  readProduct: (id) => api.get(`/products/${id}`),
  createProducts: (data) => api.post("/products", data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  sreachProducts: (params) => api.get("/products/search", { params }),

  createOrder: (data) => api.post("/orders", data),
  getAllOrders: () => api.get("/orders"),
  statusOrder: () => api.get("/orders/status"),
  updateOrderStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  getCancelledOrders: () => api.get("/orders/cancelled"),
  searchOrders: (params) => api.get("/orders/search", { params }),

  getUsers: () => api.get("/auth/users"),
  updateUser: (id, data) => api.put(`/auth/update/${id}`, data),
  deleteUser: (id) => api.delete(`/auth/delete/${id}`),
  updateUserRole: (id, data) => api.put(`/auth/role/${id}`, data),
  searchUsers: (params) => api.get("/auth/search", { params }),

  updateMyProfile: (data) => api.put("/auth/me", data),
  getMyProfile: () => api.get("/auth/me"),

  getSystemSetting: () => api.get("/settings"),
  updateSystemSetting: (data) => api.put("/settings", data),
  uploadBanner: (data) => api.post("/settings/banner", data),

  getCommentsByProduct: (productId) => api.get(`/comments/${productId}`),
  createComment: (data) => api.post("/comments", data),

  assignShipper: (orderId, data) => api.put(`/orders/${orderId}/shipper`, data),
  completeOrder: (orderId) => api.put(`/orders/${orderId}/complete`),
};

export default postApi;

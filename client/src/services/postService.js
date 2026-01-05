
import api from "./api.js";

const postApi = {
  // Product APIs
  getProducts: () => api.get("/products"),
  readProduct: (id) => api.get(`/products/${id}`),
  createProducts: (data) => api.post("/products", data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  sreachProducts: (params) => api.get("/products/search", { params }),
  
  // Order APIs
  createOrder: (data) => api.post("/orders", data),
  getAllOrders: () => api.get("/orders"),
  statusOrder: () => api.get("/orders/status"),
  updateOrderStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
  getCancelledOrders: () => api.get("/orders/cancelled"),

  //user APIs
  getUsers: () => api.get("/auth/users"),
  updateUser: (id, data) => api.put(`/auth/update/${id}`, data),
  deleteUser: (id) => api.delete(`/auth/delete/${id}`),

  // System Setting APIs
  getSystemSetting: () => api.get("/settings"),
  updateSystemSetting: (data) => api.put("/settings", data),
  uploadBanner: (data) => api.post("/settings/banner", data),

  // Comment APIs
  getCommentsByProduct: (productId) => api.get(`/comments/${productId}`),
  createComment: (data) => api.post("/comments", data),

  // Shipper APIs
  assignShipper: (orderId, data) => api.put(`/orders/${orderId}/shipper`, data),
  completeOrder: (orderId) => api.put(`/orders/${orderId}/complete`),
};

export default postApi;

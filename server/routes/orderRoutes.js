import express from "express";
import {
  createOrder,
  getAllOrders,
  statusOrder,
  updateOrderStatus,
  cancelOrder,
  getCancelledOrders
} from "../controller/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/status", statusOrder);
router.get("/", getAllOrders);
router.put("/:id/status", updateOrderStatus);
router.put("/:id/cancel", cancelOrder);
router.get("/cancelled", getCancelledOrders);
 
export default router;

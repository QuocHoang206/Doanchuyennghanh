import express from "express";
import {
  createOrder,
  getAllOrders,
  statusOrder,
  updateOrderStatus,
  cancelOrder,
  getCancelledOrders,
  assignShipper,
  completeOrder,
  
  searchOrders,
} from "../controller/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/status", statusOrder);
router.get("/", getAllOrders);
router.put("/:id/status", updateOrderStatus);
router.put("/:id/cancel", cancelOrder);
router.get("/cancelled", getCancelledOrders);
router.put("/:id/shipper", assignShipper);
router.put("/:id/complete", completeOrder);
router.get("/search", searchOrders);
export default router;

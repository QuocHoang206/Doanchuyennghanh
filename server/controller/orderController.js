import Order from "../model/orderModel.js";
import Product from "../model/productModel.js";

export const createOrder = async (req, res) => {
  try {
    const { name, email, address, district, ward, paymentMethod, items } =
      req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "Giỏ hàng trống" });

    let total = 0;

    items.forEach((i) => {
      total += i.price * i.quantity;
    });
    const userId = req.body.userId || null;
    const order = await Order.create({
      userId,
      name,
      email,
      address,
      district,
      ward,
      paymentMethod,
      items,
      total,
    });

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const statusOrder = async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $in: ["Đã xác nhận", "Hoàn thành"] },
    });

    const total = orders.reduce((sum, o) => sum + o.total, 0);

    res.json({ success: true, orderStatus: total });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    if (order.status === "Hoàn thành") {
      return res.status(400).json({
        message: "Đơn hàng đã hoàn thành, không thể thay đổi",
      });
    }

    if (status === "Đã hủy" && order.status !== "Chờ xác nhận") {
      return res.status(400).json({
        message: "Không thể hủy đơn đã xác nhận",
      });
    }

    if (status === "Đã xác nhận" && order.status === "Chờ xác nhận") {
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (!product)
          return res.status(404).json({ message: "Product not found" });

        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Không đủ số lượng cho ${product.title}`,
          });
        }

        product.stock -= item.quantity;
        await product.save();
      }
    }

    if (status === "Hoàn thành") {
      if (order.status !== "Đã xác nhận") {
        return res.status(400).json({
          message: "Chỉ có thể hoàn thành đơn đã xác nhận",
        });
      }
      order.completedAt = new Date();
    }

    order.status = status;
    await order.save();

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "Đã hủy";
    order.cancelledAt = new Date();

    await order.save();

    res.json({
      success: true,
      message: "Đơn hàng đã được hủy và sẽ tự xóa sau 30 ngày",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getCancelledOrders = async (req, res) => {
  const orders = await Order.find({ status: "Đã hủy" }).sort({
    cancelledAt: -1,
  });
  res.json({ success: true, data: orders });
};
export const assignShipper = async (req, res) => {
  try {
    const { ship } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    if (order.status !== "Chờ xác nhận") {
      return res.status(400).json({
        message: "Chỉ xác nhận đơn đang chờ",
      });
    }

    if (!["grab", "be"].includes(ship)) {
      return res.status(400).json({
        message: "Đơn vị vận chuyển không hợp lệ",
      });
    }


    for (const item of order.items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          message: `Không đủ hàng cho ${item.title}`,
        });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    order.ship = ship;
    order.status = "Đang giao";
    await order.save();

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
  
};
export const completeOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    if (order.status !== "Đang giao") {
      return res.status(400).json({
        message: "Chỉ hoàn thành đơn đang giao",
      });
    }

    order.status = "Hoàn thành";
    order.completedAt = new Date();
    await order.save();

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const searchOrders = async (req, res) => {
  const { q, cancelled } = req.query;

  try {
    const condition = {
      $or: [
        { email: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
        { status: { $regex: q, $options: "i" } },
        { paymentMethod: { $regex: q, $options: "i" } },
      ],
    };

    if (cancelled === "true") {
      condition.status = "Đã hủy";
    }

    const orders = await Order.find(condition).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

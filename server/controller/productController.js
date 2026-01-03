import Product from "../model/productModel.js";

export const createProducts = async (req, res) => {
  try {
    const { title, price, description, color, category, size, stock, discount } = req.body;

    const parsedPrice = Number(price);
    const parsedStock = Number(stock);
    const parsedDiscount = Number(discount) || 0;

    if (isNaN(parsedPrice) || parsedPrice < 0)
      return res.status(400).json({ success: false, message: "Giá không hợp lệ" });

    if (isNaN(parsedStock) || parsedStock < 0)
      return res.status(400).json({ success: false, message: "Tồn kho không hợp lệ" });

    if (parsedDiscount < 0 || parsedDiscount > 100)
      return res.status(400).json({ success: false, message: "Giảm giá 0–100%" });

    if (!title || !color || !category)
      return res.status(400).json({ success: false, message: "Thiếu thông tin sản phẩm" });

    let sizeArray = [];
    if (size && size.trim() !== "") {
      sizeArray = size
        .split(",")
        .map((s) => s.trim())
        .filter((s) => !isNaN(s) && Number(s) > 0);
    }

    if (!req.file)
      return res.status(400).json({ success: false, message: "Thiếu hình ảnh!" });

    const product = await Product.create({
      title,
      price: parsedPrice,
      description,
      color,
      category,
      size: sizeArray,
      stock: parsedStock,
      image: "/uploads/" + req.file.filename,
      discount: parsedDiscount,
    });

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};




export const readProduct = async (req, res) => {
  try {
    const products = await Product.find({ stock: { $gt: 0 } });
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Not Found" });
    }

    const body = req.body;

    if (body.price !== undefined) {
      const parsedPrice = Number(body.price);
      if (isNaN(parsedPrice) || parsedPrice < 0)
        return res.status(400).json({ success: false, message: "Giá không hợp lệ" });
      body.price = parsedPrice;
    }

    if (body.stock !== undefined) {
      const parsedStock = Number(body.stock);
      if (isNaN(parsedStock) || parsedStock < 0)
        return res.status(400).json({ success: false, message: "Tồn kho không hợp lệ" });
      body.stock = parsedStock;
    }

    if (body.discount !== undefined) {
      const parsedDiscount = Number(body.discount);
      if (parsedDiscount < 0 || parsedDiscount > 100)
        return res.status(400).json({ success: false, message: "Giảm giá 0–100%" });
      body.discount = parsedDiscount;
    }

    // ✅ SIZE ĐÚNG
    if (body.size !== undefined) {
      if (body.size.trim() === "") {
        body.size = [];
      } else {
        body.size = body.size
          .split(",")
          .map((s) => s.trim())
          .filter((s) => !isNaN(s) && Number(s) > 0);

        if (body.size.length === 0) {
          return res.status(400).json({
            success: false,
            message: "Size không hợp lệ",
          });
        }
      }
    }

    if (req.file) {
      body.image = "/uploads/" + req.file.filename;
    } else {
      body.image = existing.image;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};





export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập từ khóa tìm kiếm",
      });
    }

    const regex = new RegExp(query, "i");

    const products = await Product.find({
      stock: { $gt: 0 },
      $or: [
        { title: regex },
        { color: regex },
      ],
    });

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const SECRET_KEY = process.env.SECRET_KEY || "secret-key";
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const existing = await User.findOne({ email, phone });
    if (existing) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new User({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      role: "user",
    });

    await newUser.save();

    return res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        role: newUser.role,
      },
    });
  } catch (err) {
    return res.status(400).json({
      message: "Đăng ký thất bại",
      error: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    console.log("Login request received");
    console.log("BODY:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("USER FOUND:", user);

    if (!user) {
      console.log("ERROR: Email không tồn tại");
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      console.log("ERROR: Mật khẩu sai");
      return res
        .status(400)
        .json({ message: "Email hoặc mật khẩu không đúng" });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    console.log("TOKEN GENERATED:", token);

    return res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });
  } catch (err) {
    console.log("SERVER ERROR:", err);
    return res.status(400).json({
      message: "Đăng nhập thất bại",
      error: err.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.json({ users });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const updateData = { name, email, phone, address };
    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).select("-password");

    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    return res.json({ message: "Cập nhật thành công", user });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  if (req.user._id === req.params.id) {
    return res.status(400).json({
      message: "Không thể tự xóa chính mình",
    });
  }

  
  if (req.user.role === "admin") {
    const target = await User.findById(req.params.id);
    if (target.role !== "user") {
      return res.status(403).json({
        message: "Admin không được xóa admin",
      });
    }
  }

  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Xóa thành công" });
};


export const updateMyProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id, 
      { name, phone, address },
      { new: true }
    ).select("-password");

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
export const updateUserRole = async (req, res) => {
  const { role } = req.body;

  if (req.user._id === req.params.id) {
    return res.status(400).json({
      message: "Không thể tự thay đổi quyền của chính mình",
    });
  }

  if (req.user.role !== "superadmin") {
    return res.status(403).json({
      message: "Bạn không có quyền phân quyền admin",
    });
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select("-password");

  res.json({ message: "Cập nhật quyền thành công", user });
};

export const searchUsers = async (req, res) => {
  const { q } = req.query;

  try {
    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ],
    }).select("-password");

    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

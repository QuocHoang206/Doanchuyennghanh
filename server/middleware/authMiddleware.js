import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "secret-key";

export const verifyToken = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token không hợp lệ hoặc không tồn tại" });
    }

    const token = header.split(" ")[1];

    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; 

    next();
  } catch (err) {
    console.error("Token Error:", err.message);
    return res.status(401).json({ message: "Token hết hạn hoặc không hợp lệ" });
  }
};

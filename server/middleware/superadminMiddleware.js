export const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({
      message: "Chỉ superadmin mới có quyền này",
    });
  }
  next();
};

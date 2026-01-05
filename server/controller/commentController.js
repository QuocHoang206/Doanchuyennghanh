import Comment from "../model/commentModel.js";

export const getCommentsByProduct = async (req, res) => {
  const { productId } = req.params;
  const comments = await Comment.find({ productId }).sort({
    createdAt: -1,
  });
  res.json({ success: true, data: comments });
};

export const createComment = async (req, res) => {
  const { productId, content } = req.body;
  const user = req.user;

  if (!content.trim()) {
    return res.status(400).json({ message: "Nội dung không được rỗng" });
  }

  const comment = await Comment.create({
    productId,
    userId: user._id,
    username: user.name,
    content,
  });

  res.json({ success: true, data: comment });
};

import { asyncHandler } from "../utils/asyncHandler";
import * as commentService from "../services/comment.service";

export const createComment = asyncHandler(async (req, res) => {
  const comment = await commentService.createComment(req.body);
  res.status(201).json({
    success: true,
    message: "نظر شما ثبت شد و پس از تایید نمایش داده می‌شود",
    data: comment,
  });
});

export const getCommentsByProduct = asyncHandler(async (req, res) => {
  const comments = await commentService.getApprovedCommentsByProduct(req.params.productId);
  res.status(200).json({ success: true, data: comments });
});

export const getAllComments = asyncHandler(async (req, res) => {
  const result = await commentService.getAllComments(req.query as never);
  res.status(200).json({ success: true, ...result });
});

export const approveComment = asyncHandler(async (req, res) => {
  const isApproved = req.body.isApproved !== false; // پیش‌فرض: تایید
  const comment = await commentService.approveComment(req.params.id, isApproved);
  res.status(200).json({ success: true, data: comment });
});

export const replyToComment = asyncHandler(async (req, res) => {
  const comment = await commentService.replyToComment(req.params.id, req.body.reply);
  res.status(200).json({ success: true, data: comment, message: "پاسخ ذخیره شد" });
});

export const deleteComment = asyncHandler(async (req, res) => {
  await commentService.deleteComment(req.params.id);
  res.status(200).json({ success: true, message: "نظر حذف شد" });
});

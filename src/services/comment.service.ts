import { Comment } from "../models/Comment.model";
import { Product } from "../models/Product.model";
import { ApiError } from "../utils/ApiError";
import type { CreateCommentInput, GetCommentsQuery } from "../validations/comment.validation";

// ثبت نظر جدید برای یک محصول (عمومی - نیاز به لاگین ندارد)
export const createComment = async (data: CreateCommentInput) => {
  // zod فقط فرمت ObjectId رو چک می‌کنه؛ اینجا مطمئن می‌شیم محصول واقعاً
  // وجود داره تا نظر یتیم (وصل به محصولی که نیست) ثبت نشه.
  const productExists = await Product.exists({ _id: data.product });
  if (!productExists) {
    throw new ApiError(404, "محصول مورد نظر یافت نشد.");
  }
  return Comment.create(data);
};

// نظرات تاییدشده‌ی یک محصول خاص - برای نمایش در صفحه محصول
export const getApprovedCommentsByProduct = async (productId: string) => {
  return Comment.find({ product: productId, isApproved: true }).sort("-createdAt");
};

// لیست همه‌ی نظرات برای پنل ادمین - قابل فیلتر بر اساس محصول و وضعیت تایید
export const getAllComments = async (query: GetCommentsQuery) => {
  const filter: Record<string, unknown> = {};

  if (query.product) filter.product = query.product;
  if (query.isApproved !== undefined) filter.isApproved = query.isApproved;

  const page = query.page || 1;
  const limit = query.limit || 20;
  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    Comment.find(filter)
      .populate("product", "name images")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit),
    Comment.countDocuments(filter),
  ]);

  return {
    comments,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  };
};

export const approveComment = async (id: string, isApproved: boolean) => {
  const comment = await Comment.findByIdAndUpdate(id, { isApproved }, { new: true });
  if (!comment) {
    throw new ApiError(404, "نظر یافت نشد");
  }
  return comment;
};

export const deleteComment = async (id: string) => {
  const comment = await Comment.findByIdAndDelete(id);
  if (!comment) {
    throw new ApiError(404, "نظر یافت نشد");
  }
  return comment;
};

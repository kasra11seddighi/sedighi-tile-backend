import { asyncHandler } from "../utils/asyncHandler";
import * as orderService from "../services/order.service";

export const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(
    req.user!._id,
    req.body.shippingAddress,
    req.body.paymentMethod,
  );
  res.status(201).json({ success: true, data: order });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getMyOrders(req.user!._id);
  res.status(200).json({ success: true, data: orders });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user!);
  res.status(200).json({ success: true, data: order });
});

export const getAllOrders = asyncHandler(async (_req, res) => {
  const orders = await orderService.getAllOrders();
  res.status(200).json({ success: true, data: orders });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
  res.status(200).json({ success: true, data: order });
});

// کاربر می‌تونه سفارش خودش رو تا وقتی هنوز pending هست لغو کنه
export const cancelMyOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelOwnOrder(req.params.id, req.user!._id);
  res.status(200).json({ success: true, data: order });
});

// شروع پرداخت آنلاین زرین‌پال؛ تا وقتی merchant id تنظیم نشده، سرویس خودش
// ApiError(503) با پیام روشن پرتاب می‌کنه (نگاه کن به zarinpal.service.ts)
export const payOrder = asyncHandler(async (req, res) => {
  const result = await orderService.initiateOrderPayment(req.params.id, req.user!._id);
  res.status(200).json({ success: true, data: result });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const authority = req.query.Authority as string;
  const result = await orderService.verifyOrderPayment(req.params.id, authority);
  res.status(200).json({ success: true, data: result });
});

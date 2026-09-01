import { asyncHandler } from "../utils/asyncHandler";
import * as cartService from "../services/cart.service";

export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getOrCreateCart(req.user!._id);
  res.status(200).json({ success: true, data: cart });
});

export const addItem = asyncHandler(async (req, res) => {
  const { productId, ...rest } = req.body;
  const cart = await cartService.addItem(req.user!._id, productId, rest);
  res.status(200).json({ success: true, data: cart });
});

export const updateItem = asyncHandler(async (req, res) => {
  const cart = await cartService.updateItemQuantity(
    req.user!._id,
    req.params.productId,
    req.body,
  );
  res.status(200).json({ success: true, data: cart });
});

export const removeItem = asyncHandler(async (req, res) => {
  const cart = await cartService.removeItem(req.user!._id, req.params.productId);
  res.status(200).json({ success: true, data: cart });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await cartService.clearCart(req.user!._id);
  res.status(200).json({ success: true, data: cart });
});

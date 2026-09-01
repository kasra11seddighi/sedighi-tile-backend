import { asyncHandler } from "../utils/asyncHandler";
import * as favoriteService from "../services/favorite.service";

export const addFavorite = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const favorite = await favoriteService.addFavorite(req.user!._id, productId);
  res.status(201).json({ success: true, data: favorite });
});

export const getFavorites = asyncHandler(async (req, res) => {
  const favorites = await favoriteService.getFavorites(req.user!._id);
  res.status(200).json({ success: true, data: favorites });
});

export const removeFavorite = asyncHandler(async (req, res) => {
  await favoriteService.removeFavorite(req.user!._id, req.params.productId);
  res.status(200).json({ success: true, data: null });
});

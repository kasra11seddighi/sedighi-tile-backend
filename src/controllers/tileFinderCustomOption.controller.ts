import { asyncHandler } from "../utils/asyncHandler";
import * as service from "../services/tileFinderCustomOption.service";

export const getCustomOptions = asyncHandler(async (req, res) => {
  const data = await service.getByStep(req.params.stepId);
  res.status(200).json({ success: true, data });
});

export const createCustomOption = asyncHandler(async (req, res) => {
  const data = await service.create(req.params.stepId, req.body);
  res.status(201).json({ success: true, data });
});

export const updateCustomOption = asyncHandler(async (req, res) => {
  const data = await service.update(req.params.id, req.body);
  res.status(200).json({ success: true, data });
});

export const deleteCustomOption = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  res.status(200).json({ success: true, message: "حذف شد" });
});

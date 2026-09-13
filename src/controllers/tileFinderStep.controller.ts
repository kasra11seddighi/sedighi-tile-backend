import { asyncHandler } from "../utils/asyncHandler";
import * as service from "../services/tileFinderStep.service";

export const getActiveSteps = asyncHandler(async (_req, res) => {
  res.status(200).json({ success: true, data: await service.getActiveSteps() });
});

export const getActiveStepsWithOptions = asyncHandler(async (_req, res) => {
  res.status(200).json({ success: true, data: await service.getActiveStepsWithOptions() });
});

export const getAllSteps = asyncHandler(async (_req, res) => {
  res.status(200).json({ success: true, data: await service.getAllSteps() });
});

export const createStep = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await service.createStep(req.body) });
});

export const updateStep = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: await service.updateStep(req.params.id, req.body),
  });
});

export const deleteStep = asyncHandler(async (req, res) => {
  await service.deleteStep(req.params.id);
  res.status(200).json({ success: true, message: "مرحله حذف شد" });
});

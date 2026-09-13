import { asyncHandler } from "../utils/asyncHandler";
import * as testimonialService from "../services/testimonial.service";

export const getPublicTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await testimonialService.getPublicTestimonials(req.query as never);
  res.status(200).json({ success: true, data: testimonials });
});

// پنل ادمین - همه نظرات (فعال و غیرفعال)
export const getAllTestimonials = asyncHandler(async (_req, res) => {
  const testimonials = await testimonialService.getAllTestimonials();
  res.status(200).json({ success: true, data: testimonials });
});

export const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.createTestimonial(req.body);
  res.status(201).json({ success: true, data: testimonial });
});

export const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await testimonialService.updateTestimonial(req.params.id, req.body);
  res.status(200).json({ success: true, data: testimonial });
});

export const deleteTestimonial = asyncHandler(async (req, res) => {
  await testimonialService.deleteTestimonial(req.params.id);
  res.status(200).json({ success: true, message: "نظر مشتری حذف شد." });
});

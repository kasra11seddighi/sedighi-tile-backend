import { asyncHandler } from "../utils/asyncHandler";
import * as faqService from "../services/faq.service";

export const getPublicFaqs = asyncHandler(async (_req, res) => {
  const faqs = await faqService.getPublicFaqs();
  res.status(200).json({ success: true, data: faqs });
});

export const getAllFaqs = asyncHandler(async (_req, res) => {
  const faqs = await faqService.getAllFaqs();
  res.status(200).json({ success: true, data: faqs });
});

export const createFaq = asyncHandler(async (req, res) => {
  const faq = await faqService.createFaq(req.body);
  res.status(201).json({ success: true, data: faq });
});

export const updateFaq = asyncHandler(async (req, res) => {
  const faq = await faqService.updateFaq(req.params.id, req.body);
  res.status(200).json({ success: true, data: faq });
});

export const deleteFaq = asyncHandler(async (req, res) => {
  await faqService.deleteFaq(req.params.id);
  res.status(200).json({ success: true, message: "سوال متداول حذف شد" });
});

import { asyncHandler } from "../utils/asyncHandler";
import * as contactMessageService from "../services/contactMessage.service";

export const createMessage = asyncHandler(async (req, res) => {
  const message = await contactMessageService.createMessage(req.body);
  res.status(201).json({
    success: true,
    message: "پیام شما با موفقیت ارسال شد",
    data: message,
  });
});

export const getMessages = asyncHandler(async (_req, res) => {
  const messages = await contactMessageService.getMessages();
  res.status(200).json({ success: true, data: messages });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const message = await contactMessageService.markAsRead(req.params.id);
  res.status(200).json({ success: true, data: message });
});

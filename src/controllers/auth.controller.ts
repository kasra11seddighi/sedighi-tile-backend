import { asyncHandler } from "../utils/asyncHandler";
import * as authService from "../services/auth.service";

export const sendOtp = asyncHandler(async (req, res) => {
  const result = await authService.sendOtp(req.body);
  res.status(200).json({ success: true, data: result });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const result = await authService.verifyOtp(req.body);
  res.status(200).json({ success: true, data: result });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = req.user!;
  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
    },
  });
});

// پنل ادمین - لیست کاربران ثبت‌نامی
export const getUsers = asyncHandler(async (_req, res) => {
  const users = await authService.getAllUsers();
  res.status(200).json({ success: true, data: users });
});

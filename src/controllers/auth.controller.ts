import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import * as authService from "../services/auth.service";

export const sendOtp = asyncHandler(async (req, res) => {
  const result = await authService.sendOtp(req.body);
  res.status(200).json({ success: true, data: result });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { user, token } = await authService.verifyOtp(req.body);

  // توکن توی body پاسخ برمی‌گرده؛ فرانت خودش توی localStorage نگهش
  // می‌داره و با هدر Authorization: Bearer می‌فرستدش. دیگه وابسته به
  // کوکی/CORS credentials/SameSite نیستیم، پس روی هر originای (لوکال یا
  // پروداکشن، http یا https) بدون تنظیمات اضافه کار می‌کنه.
  res.status(200).json({ success: true, data: { user, token } });
});

export const logout = asyncHandler(async (_req, res) => {
  // چون توکن stateless (JWT) هست و سمت کلاینت (localStorage) نگه‌داری
  // می‌شه، بک‌اند چیزی برای پاک‌کردن نداره؛ فرانت خودش توکن رو حذف می‌کنه.
  res.status(200).json({ success: true, data: null });
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

// پنل ادمین - حذف یک کاربر
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await authService.deleteUserById(req.params.id);
  if (!user) {
    throw new ApiError(404, "کاربر پیدا نشد");
  }

  res.status(200).json({ success: true, data: null });
});

// ویرایش پروفایل کاربر لاگین‌شده
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user!._id.toString(), req.body);
  res.status(200).json({ success: true, data: user });
});

// دفترچه آدرس
export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await authService.getAddresses(req.user!._id.toString());
  res.status(200).json({ success: true, data: addresses });
});

export const addAddress = asyncHandler(async (req, res) => {
  const addresses = await authService.addAddress(req.user!._id.toString(), req.body);
  res.status(201).json({ success: true, data: addresses });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const addresses = await authService.updateAddress(
    req.user!._id.toString(),
    req.params.addressId,
    req.body,
  );
  res.status(200).json({ success: true, data: addresses });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const addresses = await authService.deleteAddress(
    req.user!._id.toString(),
    req.params.addressId,
  );
  res.status(200).json({ success: true, data: addresses });
});

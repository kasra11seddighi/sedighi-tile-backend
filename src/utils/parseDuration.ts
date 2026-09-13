/**
 * رشته‌ی مدت‌زمان به سبک jsonwebtoken (مثل "7d"، "12h"، "30m"، "3600s")
 * رو به میلی‌ثانیه تبدیل می‌کنه. برای تعیین maxAge کوکی توکن استفاده می‌شه
 * تا عمر کوکی هم‌راستا با عمر خودِ JWT بمونه.
 *
 * چون در این پروژه پکیج جداگانه‌ای (مثل ms) برای این تبدیل نصب نیست،
 * یه پارسر ساده و کافی برای فرمت‌های رایج پیاده شده.
 */
export const parseDurationToMs = (value: string, fallbackMs = 7 * 24 * 60 * 60 * 1000): number => {
  const match = /^(\d+)\s*(ms|s|m|h|d)?$/i.exec(value.trim());
  if (!match) return fallbackMs;

  const amount = Number(match[1]);
  const unit = (match[2] || "ms").toLowerCase();

  const unitToMs: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return amount * (unitToMs[unit] ?? 1);
};

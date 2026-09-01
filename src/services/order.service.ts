import { Types } from "mongoose";
import { Cart } from "../models/Cart.model";
import { Order, OrderStatus } from "../models/Order.model";
import { Product, IProduct } from "../models/Product.model";
import { ApiError } from "../utils/ApiError";
import { IUser } from "../models/User.model";
import { ShippingAddress } from "../validations/order.validation";
import { calculateTileSale } from "./cart.service";
import * as zarinpalService from "./zarinpal.service";

export const createOrder = async (
  userId: Types.ObjectId | string,
  shippingAddress: ShippingAddress,
  paymentMethod: "cod" | "online" = "cod",
) => {
  const cart = await Cart.findOne({ user: userId }).populate<{
    items: {
      product: IProduct;
      quantity: number;
      saleUnit?: "m2" | "carton";
      requestedM2?: number;
      cartons?: number;
    }[];
  }>("items.product");

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, "سبد خرید شما خالی است.");
  }

  // بررسی موجودی و ساخت آیتم‌های سفارش
  const orderItems: {
    product: Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
    saleUnit?: "m2" | "carton";
    requestedM2?: number;
    cartons?: number;
    actualM2?: number;
  }[] = [];
  let totalAmount = 0;

  for (const item of cart.items) {
    const product = item.product;
    if (!product || !product.isActive) {
      throw new ApiError(400, `محصول «${product?.name || ""}» دیگر موجود نیست.`);
    }

    // نکته‌ی امنیتی مهم: هیچ‌وقت قیمت/تعداد ذخیره‌شده در سبد رو به‌عنوان
    // منبع نهایی قبول نمی‌کنیم؛ همین الان دوباره از روی اطلاعات واقعی
    // محصول (قیمت فعلی، موجودی فعلی) محاسبه‌ش می‌کنیم.
    if (item.saleUnit) {
      const calc = calculateTileSale(product, item.saleUnit, {
        requestedM2: item.requestedM2,
        cartons: item.cartons,
      });

      totalAmount += calc.totalPrice;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: calc.unitPrice,
        quantity: calc.stockToReserve,
        saleUnit: calc.saleUnit,
        requestedM2: calc.requestedM2,
        cartons: calc.cartons,
        actualM2: calc.actualM2,
      });
    } else {
      if (product.stock < item.quantity) {
        throw new ApiError(400, `موجودی «${product.name}» کافی نیست.`);
      }

      const price = product.discountPrice > 0 ? product.discountPrice : product.price;
      totalAmount += price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        price,
        quantity: item.quantity,
      });
    }
  }

  // --- کسر اتمیک موجودی ---
  // نکته‌ی مهم: بین چک موجودی در حلقه‌ی بالا و اینجا، ممکنه سفارش هم‌زمان
  // دیگه‌ای همون محصول رو رزرو کرده باشه (race condition). به همین خاطر
  // موجودی رو با یک عملیات اتمیک findOneAndUpdate + شرط stock >= quantity
  // کم می‌کنیم؛ اگه شرط برقرار نبود یعنی موجودی واقعی دیگه کافی نیست و کل
  // سفارش رو fail و موجودیِ آیتم‌هایی که قبلاً کم شده بودن rollback می‌کنیم.
  const reserved: { product: Types.ObjectId; quantity: number }[] = [];
  try {
    for (const item of orderItems) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
      );
      if (!updated) {
        throw new ApiError(400, `موجودی «${item.name}» کافی نیست.`);
      }
      reserved.push({ product: item.product, quantity: item.quantity });
    }
  } catch (err) {
    // rollback موجودیِ آیتم‌هایی که تا قبل از خطا موفق کم شده بودن
    await Promise.all(
      reserved.map((r) =>
        Product.findByIdAndUpdate(r.product, { $inc: { stock: r.quantity } }),
      ),
    );
    throw err;
  }

  // ساخت سفارش
  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount,
    shippingAddress,
    paymentMethod,
  });

  // خالی کردن سبد خرید
  cart.items = [];
  await cart.save();

  return order;
};

export const getMyOrders = async (userId: Types.ObjectId | string) => {
  return Order.find({ user: userId }).sort({ createdAt: -1 });
};

export const getOrderById = async (orderId: string, user: IUser) => {
  const order = await Order.findById(orderId).populate("user", "name phone");
  if (!order) throw new ApiError(404, "سفارش یافت نشد.");

  if (
    user.role !== "admin" &&
    order.user._id.toString() !== user._id.toString()
  ) {
    throw new ApiError(403, "شما به این سفارش دسترسی ندارید.");
  }
  return order;
};

export const getAllOrders = async () => {
  return Order.find().populate("user", "name phone").sort({ createdAt: -1 });
};

// موجودیِ آیتم‌هایی که موقع ثبت سفارش از انبار کم شده بودن رو برمی‌گردونه؛
// هم موقع لغو توسط ادمین هم موقع لغو توسط خود کاربر استفاده می‌شه.
async function restockOrderItems(items: { product: Types.ObjectId; quantity: number }[]) {
  await Promise.all(
    items.map((item) =>
      Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } }),
    ),
  );
}

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const existing = await Order.findById(orderId);
  if (!existing) throw new ApiError(404, "سفارش یافت نشد.");

  const isBeingCancelled = status === "cancelled" && existing.status !== "cancelled";

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true, runValidators: true },
  );
  if (!order) throw new ApiError(404, "سفارش یافت نشد.");

  if (isBeingCancelled) {
    await restockOrderItems(order.items);
  }

  return order;
};

// کاربر فقط تا وقتی سفارش هنوز «در انتظار بررسی»ه می‌تونه خودش لغوش کنه؛
// بعد از اینکه ادمین وارد پردازش/ارسال شد، لغو باید از طریق پشتیبانی انجام بشه.
export const cancelOwnOrder = async (orderId: string, userId: Types.ObjectId | string) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "سفارش یافت نشد.");

  if (order.user.toString() !== userId.toString()) {
    throw new ApiError(403, "شما به این سفارش دسترسی ندارید.");
  }
  if (order.status !== "pending") {
    throw new ApiError(
      400,
      "این سفارش وارد مرحله‌ی پردازش شده و دیگر قابل لغو توسط شما نیست. برای لغو با پشتیبانی تماس بگیرید.",
    );
  }

  order.status = "cancelled";
  await order.save();
  await restockOrderItems(order.items);

  return order;
};

/** شروع پرداخت آنلاین: سفارش باید مال همین کاربر، paymentMethod آنلاین و هنوز unpaid باشه */
export const initiateOrderPayment = async (orderId: string, userId: Types.ObjectId | string) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "سفارش یافت نشد.");
  if (order.user.toString() !== userId.toString()) {
    throw new ApiError(403, "شما به این سفارش دسترسی ندارید.");
  }
  if (order.paymentMethod !== "online") {
    throw new ApiError(400, "این سفارش با روش پرداخت در محل ثبت شده است.");
  }
  if (order.paymentStatus === "paid") {
    throw new ApiError(400, "این سفارش قبلاً پرداخت شده است.");
  }

  const { authority, paymentUrl } = await zarinpalService.requestPayment(
    order.totalAmount,
    `پرداخت سفارش #${order._id.toString().slice(-6)}`,
    order._id.toString(),
  );

  order.paymentAuthority = authority;
  await order.save();

  return { paymentUrl };
};

/** برگشت از درگاه: تراکنش رو verify و وضعیت سفارش رو آپدیت می‌کنیم */
export const verifyOrderPayment = async (orderId: string, authority: string) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "سفارش یافت نشد.");
  if (order.paymentAuthority !== authority) {
    throw new ApiError(400, "شناسه‌ی تراکنش نامعتبر است.");
  }

  const { isSuccessful, refId } = await zarinpalService.verifyPayment(
    authority,
    order.totalAmount,
  );

  if (isSuccessful) {
    order.paymentStatus = "paid";
    order.paymentRefId = refId;
    await order.save();
  }

  return { isSuccessful, order };
};

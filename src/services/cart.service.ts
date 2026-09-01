import { Types } from "mongoose";
import { Cart } from "../models/Cart.model";
import { Product, IProduct } from "../models/Product.model";
import { ApiError } from "../utils/ApiError";
import { AddItemInput, UpdateItemInput } from "../validations/cart.validation";

const POPULATE_FIELDS =
  "name price discountPrice images stock pricePerM2 pricePerCarton piecesPerCarton m2PerCarton tileWidth tileHeight saleUnit";

export const getOrCreateCart = async (userId: Types.ObjectId | string) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product", POPULATE_FIELDS);
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

/**
 * از روی اطلاعات واقعیِ محصول (که از دیتابیس خونده شده، نه چیزی که فرانت فرستاده)
 * مقادیر نهاییِ تعداد کارتن، متراژ واقعی، قیمت واحد و قیمت کل رو محاسبه می‌کنه.
 * این تابع تنها منبع معتبر برای محاسبات فروش متری/کارتنیه؛ فرانت فقط برای
 * نمایش سریع همین فرمول رو تکرار می‌کنه ولی هیچ‌وقت مبنای ذخیره‌سازی نیست.
 */
export function calculateTileSale(
  product: IProduct,
  saleUnit: "m2" | "carton",
  amount: { requestedM2?: number; cartons?: number },
) {
  if (!product.saleUnit) {
    throw new ApiError(400, "این محصول به‌صورت متری یا کارتنی فروخته نمی‌شود.");
  }

  if (product.saleUnit !== "both" && product.saleUnit !== saleUnit) {
    throw new ApiError(
      400,
      product.saleUnit === "m2"
        ? "این محصول فقط به‌صورت متری فروخته می‌شود."
        : "این محصول فقط به‌صورت کارتنی فروخته می‌شود.",
    );
  }

  if (saleUnit === "carton") {
    const cartons = amount.cartons;
    if (!cartons || cartons <= 0 || !Number.isInteger(cartons)) {
      throw new ApiError(400, "تعداد کارتن نامعتبر است.");
    }
    if (!product.pricePerCarton) {
      throw new ApiError(400, "قیمت کارتنی برای این محصول تعریف نشده است.");
    }

    const actualM2 = product.m2PerCarton ? cartons * product.m2PerCarton : undefined;
    const unitPrice = product.pricePerCarton;
    const totalPrice = cartons * unitPrice;

    if (product.stock < cartons) {
      throw new ApiError(400, "موجودی کافی نیست.");
    }

    return {
      saleUnit: "carton" as const,
      requestedM2: undefined,
      cartons,
      actualM2,
      unitPrice,
      totalPrice,
      stockToReserve: cartons,
    };
  }

  // saleUnit === "m2"
  const requestedM2 = amount.requestedM2;
  if (!requestedM2 || requestedM2 <= 0) {
    throw new ApiError(400, "متراژ درخواستی نامعتبر است.");
  }

  // اگه اطلاعات کارتن موجود باشه، تعداد کارتن لازم رو گرد به بالا حساب می‌کنیم
  // و قیمت رو از روی قیمت کارتنی (نه ضرب مستقیم متر در pricePerM2) درمیاریم،
  // چون در دنیای واقعی فروشگاه کاشی، همیشه یه عدد کامل کارتن فروخته می‌شه.
  if (product.m2PerCarton && product.pricePerCarton) {
    const cartons = Math.ceil(requestedM2 / product.m2PerCarton);
    const actualM2 = cartons * product.m2PerCarton;
    const unitPrice = product.pricePerCarton;
    const totalPrice = cartons * unitPrice;

    if (product.stock < cartons) {
      throw new ApiError(400, "موجودی کافی نیست.");
    }

    return {
      saleUnit: "m2" as const,
      requestedM2,
      cartons,
      actualM2,
      unitPrice,
      totalPrice,
      stockToReserve: cartons,
    };
  }

  // محصولی که فقط قیمت متری داره و اطلاعات کارتن‌بندی نداره
  if (!product.pricePerM2) {
    throw new ApiError(400, "قیمت متری برای این محصول تعریف نشده است.");
  }

  const unitPrice = product.pricePerM2;
  const totalPrice = Math.round(requestedM2 * unitPrice);

  if (product.stock < requestedM2) {
    throw new ApiError(400, "موجودی کافی نیست.");
  }

  return {
    saleUnit: "m2" as const,
    requestedM2,
    cartons: undefined,
    actualM2: requestedM2,
    unitPrice,
    totalPrice,
    stockToReserve: requestedM2,
  };
}

export const addItem = async (
  userId: Types.ObjectId | string,
  productId: string,
  input: Omit<AddItemInput, "productId">,
) => {
  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "محصول یافت نشد.");

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  // --- محصول کاشی/سرامیک با فروش متری یا کارتنی ---
  if (input.saleUnit) {
    const calc = calculateTileSale(product, input.saleUnit, {
      requestedM2: input.requestedM2,
      cartons: input.cartons,
    });

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId && item.saleUnit === calc.saleUnit,
    );

    if (existingItem) {
      // اضافه‌کردن به مقدار قبلی و محاسبه‌ی دوباره‌ی نهایی از صفر
      const mergedAmount =
        calc.saleUnit === "carton"
          ? { cartons: (existingItem.cartons ?? 0) + (calc.cartons ?? 0) }
          : { requestedM2: (existingItem.requestedM2 ?? 0) + (calc.requestedM2 ?? 0) };

      const merged = calculateTileSale(product, calc.saleUnit, mergedAmount);

      existingItem.requestedM2 = merged.requestedM2;
      existingItem.cartons = merged.cartons;
      existingItem.actualM2 = merged.actualM2;
      existingItem.unitPrice = merged.unitPrice;
      existingItem.totalPrice = merged.totalPrice;
      existingItem.quantity = merged.stockToReserve;
    } else {
      cart.items.push({
        product: product._id,
        quantity: calc.stockToReserve,
        saleUnit: calc.saleUnit,
        requestedM2: calc.requestedM2,
        cartons: calc.cartons,
        actualM2: calc.actualM2,
        unitPrice: calc.unitPrice,
        totalPrice: calc.totalPrice,
      });
    }

    await cart.save();
    return cart.populate("items.product", POPULATE_FIELDS);
  }

  // --- محصول معمولی (بدون saleUnit): دقیقاً همون رفتار قبلی ---
  const quantity = input.quantity ?? 1;
  if (product.stock < quantity) {
    throw new ApiError(400, "موجودی کافی نیست.");
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId && !item.saleUnit,
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: product._id, quantity });
  }

  await cart.save();
  return cart.populate("items.product", POPULATE_FIELDS);
};

export const updateItemQuantity = async (
  userId: Types.ObjectId | string,
  productId: string,
  input: UpdateItemInput,
) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, "سبد خرید یافت نشد.");

  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) throw new ApiError(404, "این محصول در سبد خرید نیست.");

  if (input.saleUnit) {
    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, "محصول یافت نشد.");

    const calc = calculateTileSale(product, input.saleUnit, {
      requestedM2: input.requestedM2,
      cartons: input.cartons,
    });

    item.saleUnit = calc.saleUnit;
    item.requestedM2 = calc.requestedM2;
    item.cartons = calc.cartons;
    item.actualM2 = calc.actualM2;
    item.unitPrice = calc.unitPrice;
    item.totalPrice = calc.totalPrice;
    item.quantity = calc.stockToReserve;
  } else {
    if (!input.quantity) throw new ApiError(400, "تعداد الزامی است.");
    item.quantity = input.quantity;
  }

  await cart.save();
  return cart.populate("items.product", POPULATE_FIELDS);
};

export const removeItem = async (userId: Types.ObjectId | string, productId: string) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, "سبد خرید یافت نشد.");

  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  await cart.save();
  return cart.populate("items.product", POPULATE_FIELDS);
};

export const clearCart = async (userId: Types.ObjectId | string) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, "سبد خرید یافت نشد.");
  cart.items = [];
  await cart.save();
  return cart;
};

import { Schema, model, Document, Types } from "mongoose";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cod" | "online";
export type PaymentStatus = "unpaid" | "paid";

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;

  // --- فروش متری/کارتنی (اختیاری؛ فقط برای آیتم‌های کاشی/سرامیک) ---
  saleUnit?: "m2" | "carton";
  requestedM2?: number;
  cartons?: number;
  actualM2?: number;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  // شماره‌ی ثابت اختیاریه؛ فقط شماره‌ی موبایل (phone) الزامیه
  landlinePhone?: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  shippingAddress: IShippingAddress;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  // فقط برای paymentMethod === "online": شناسه‌ی تراکنش زرین‌پال
  paymentAuthority?: string;
  paymentRefId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },

    saleUnit: { type: String, enum: ["m2", "carton"] },
    requestedM2: { type: Number, min: 0 },
    cartons: { type: Number, min: 0 },
    actualM2: { type: Number, min: 0 },
  },
  { _id: false },
);

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      landlinePhone: { type: String },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },
    // پرداخت درب‌منزل تا لحظه‌ی تحویل «unpaid» می‌مونه؛ فقط بعد از verify
    // موفق زرین‌پال برای paymentMethod === "online" مقدار "paid" می‌گیره.
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    paymentAuthority: { type: String },
    paymentRefId: { type: String },
  },
  { timestamps: true },
);

export const Order = model<IOrder>("Order", orderSchema);

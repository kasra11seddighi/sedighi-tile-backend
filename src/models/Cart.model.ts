import { Schema, model, Document, Types } from "mongoose";

export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;

  // --- فروش متری/کارتنی (اختیاری؛ فقط وقتی محصول saleUnit داره پر می‌شه) ---
  saleUnit?: "m2" | "carton";
  requestedM2?: number;
  cartons?: number;
  actualM2?: number;
  unitPrice?: number;
  totalPrice?: number;
}

export interface ICart extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId | null;
  guestId: string | null;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },

    saleUnit: { type: String, enum: ["m2", "carton"] },
    requestedM2: { type: Number, min: 0 },
    cartons: { type: Number, min: 0 },
    actualM2: { type: Number, min: 0 },
    unitPrice: { type: Number, min: 0 },
    totalPrice: { type: Number, min: 0 },
  },
  { _id: false },
);

const cartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", default: null },
    guestId: { type: String, default: null },
    items: [cartItemSchema],
  },
  { timestamps: true },
);

// فقط برای user لاگین‌شده unique باشد
cartSchema.index(
  { user: 1 },
  { unique: true, partialFilterExpression: { user: { $type: "objectId" } } },
);

// فقط برای مهمان unique باشد
cartSchema.index(
  { guestId: 1 },
  { unique: true, partialFilterExpression: { guestId: { $type: "string" } } },
);

export const Cart = model<ICart>("Cart", cartSchema);

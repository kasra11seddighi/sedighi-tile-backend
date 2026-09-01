import { Schema, model, Document, Types } from "mongoose";

export interface IFavorite extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  product: Types.ObjectId;
  createdAt: Date;
}

const favoriteSchema = new Schema<IFavorite>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// یک کاربر نباید بتواند یک محصول را چند بار Favorite کند
favoriteSchema.index({ user: 1, product: 1 }, { unique: true });

export const Favorite = model<IFavorite>("Favorite", favoriteSchema);

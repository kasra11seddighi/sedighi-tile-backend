import "dotenv/config";
import { connectDB } from "../config/db";
import { ProductSortOption } from "../models/ProductSortOption.model";
import mongoose from "mongoose";

async function createSortOptions(): Promise<void> {
  try {
    await connectDB();

    await ProductSortOption.deleteMany();

    await ProductSortOption.insertMany([
      { value: "-createdAt", label: "جدیدترین", order: 1, isActive: true },
      { value: "createdAt", label: "قدیمی‌ترین", order: 2, isActive: true },
      { value: "price", label: "ارزان‌ترین", order: 3, isActive: true },
      { value: "-price", label: "گران‌ترین", order: 4, isActive: true },
    ]);

    console.log("✅ Product sort options created");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

createSortOptions();

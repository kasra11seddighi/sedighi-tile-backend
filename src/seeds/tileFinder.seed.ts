import "dotenv/config";
import mongoose from "mongoose";
import { TileFinderLocation } from "../models/TileFinderLocation.model";
import { TileFinderSize } from "../models/TileFinderSize.model";
import { TileFinderStyle } from "../models/TileFinderStyle.model";
import { TileFinderColor } from "../models/TileFinderColor.model";
import { env } from "../config/env";

const locations = [
  { name: "آشپزخانه", slug: "kitchen", order: 1 },
  { name: "حمام", slug: "bathroom", order: 2 },
  { name: "پذیرایی", slug: "living-room", order: 3 },
  { name: "اتاق خواب", slug: "bedroom", order: 4 },
  { name: "راهرو", slug: "hallway", order: 5 },
  { name: "فضای تجاری", slug: "commercial", order: 6 },
];

const sizes = [
  { name: "30 × 30", slug: "30x30", order: 1 },
  { name: "40 × 40", slug: "40x40", order: 2 },
  { name: "60 × 60", slug: "60x60", order: 3 },
  { name: "60 × 120", slug: "60x120", order: 4 },
  { name: "80 × 80", slug: "80x80", order: 5 },
  { name: "120 × 120", slug: "120x120", order: 6 },
];

const styles = [
  { name: "مدرن", slug: "modern", order: 1 },
  { name: "مینیمال", slug: "minimal", order: 2 },
  { name: "کلاسیک", slug: "classic", order: 3 },
  { name: "سنتی", slug: "traditional", order: 4 },
  { name: "لوکس", slug: "luxury", order: 5 },
];

const colors = [
  { name: "سفید", slug: "white", hex: "#FFFFFF", order: 1 },
  { name: "مشکی", slug: "black", hex: "#000000", order: 2 },
  { name: "طوسی", slug: "gray", hex: "#808080", order: 3 },
  { name: "کرم", slug: "cream", hex: "#FFFDD0", order: 4 },
  { name: "بژ", slug: "beige", hex: "#F5F5DC", order: 5 },
  { name: "قهوه‌ای", slug: "brown", hex: "#8B4513", order: 6 },
];

async function seedTileFinder(): Promise<void> {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("MongoDB Connected");

    await TileFinderLocation.deleteMany({});
    await TileFinderSize.deleteMany({});
    await TileFinderStyle.deleteMany({});
    await TileFinderColor.deleteMany({});

    await TileFinderLocation.insertMany(locations);
    await TileFinderSize.insertMany(sizes);
    await TileFinderStyle.insertMany(styles);
    await TileFinderColor.insertMany(colors);

    console.log("✅ Tile Finder data inserted successfully");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Tile Finder seed error:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedTileFinder();

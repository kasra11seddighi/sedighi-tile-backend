import "dotenv/config";
import mongoose from "mongoose";
import { TileFinderStep } from "../models/TileFinderStep.model";
import { env } from "../config/env";

const steps = [
  { title: "انتخاب فضا", source: "locations", order: 1, isActive: true },
  { title: "انتخاب سایز", source: "sizes", order: 2, isActive: true },
  { title: "انتخاب برند", source: "brands", order: 3, isActive: true },
  { title: "انتخاب سبک", source: "styles", order: 4, isActive: true },
  { title: "انتخاب رنگ", source: "colors", order: 5, isActive: true },
];

async function seed(): Promise<void> {
  try {
    await mongoose.connect(env.MONGO_URI);
    for (const step of steps) {
      await TileFinderStep.findOneAndUpdate(
        { source: step.source },
        step,
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }
    console.log("✅ Tile Finder steps seeded");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Tile Finder steps seed error:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

void seed();

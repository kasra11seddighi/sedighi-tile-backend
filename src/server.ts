import { createApp } from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { User } from "./models/User.model";

const start = async (): Promise<void> => {
  try {
    const app = createApp();

    const port = Number(env.PORT) || 3000;

    app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${port}`);
    });

    await connectDB();
    console.log("✅ MongoDB connected successfully");

    if (env.NODE_ENV !== "production") {
      await User.syncIndexes();
      console.log("✅ User indexes synchronized");
    }
  } catch (error) {
    console.error("❌ Application startup failed:", error);
    process.exit(1);
  }
};

void start();

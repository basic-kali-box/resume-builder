import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    console.log("🔗 Attempting MongoDB connection...");
    console.log("📍 URI:", process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "ai_resume_builder",
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000, // 45 second socket timeout
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    return conn;
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    console.error("Stack trace:", err.stack);
    throw new ApiError(500, "Database connection failed", [], err.stack);
  }
};

export { connectDB };

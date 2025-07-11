import { config } from "dotenv";
config();

import app from "./app.js";
import { connectDB } from "./db/index.js";

const PORT = process.env.PORT || 8080;

console.log("🚀 Starting AI Resume Builder Server...");
console.log("📊 Environment:", process.env.NODE_ENV);
console.log("🔌 Port:", PORT);
console.log("🗄️ MongoDB URI:", process.env.MONGODB_URI ? "✅ Set" : "❌ Missing");
console.log("🔑 JWT Secret:", process.env.JWT_SECRET_KEY ? "✅ Set" : "❌ Missing");
console.log("🤖 Gemini API Key:", process.env.GEMINI_API_KEY ? "✅ Set" : "❌ Missing");

// Start server with proper error handling
const startServer = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await connectDB();
    console.log("✅ Database connected successfully");

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/api/users/health`);
    });

    // Handle server errors
    server.on('error', (error) => {
      console.error("❌ Server error:", error);
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🛑 SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
};

startServer();

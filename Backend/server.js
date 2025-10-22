const app = require("./app");
const dotenv = require("dotenv");

// Load environment variables
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const port = process.env.PORT || 7001;
const NODE_ENV = process.env.NODE_ENV || "development";

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception! 💥", err.name, err.message);
  process.exit(1);
});

const server = app.listen(port, () => {
  console.log(`🚀 Server running in ${NODE_ENV} mode`);
  console.log(`📍 Local: http://localhost:${port}`);
  console.log("Server Is Online...");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection! 💥", err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});

module.exports = server;

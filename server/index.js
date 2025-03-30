import express from "express";
import cors from "cors";
import recordRouter from "./routes/record.js";
import dotenv from "dotenv";
import { connect } from "./db/connection.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
(async () => {
  try {
    await connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
})();

// Mount your router with proper base path
app.use("/api", recordRouter); // Changed from "/record" to "/api"

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({ status: "API is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// Start server only in local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5050;
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

// Export for Vercel
export default app;
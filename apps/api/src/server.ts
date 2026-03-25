import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { isTest } from "env";

import txsRoutes from "@/routes/txsRoutes";

// Create Express application
const app = express();

app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(
  morgan("dev", {
    skip: () => isTest(),
  }),
); // Logging

// Health check endpoint - always good to have!
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Personal Finance API!",
  });
});

// app.use("/auth", authRoutes);
app.use("/api/transactions", txsRoutes);
// app.use("/api/habits", habitRoutes);
// app.use("/api/tags", tagRoutes);

// Export the app for use in other modules (like tests)
export { app };

// Default export for convenience
export default app;

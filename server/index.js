
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const recordRoutes = require("./routes/recordRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Welcome route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to ASTRA - Astronaut Health Monitoring System",
  });
});

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "ASTRA backend is running successfully!",
    timestamp: new Date().toISOString(),
  });
});

// Health records routes
app.use("/api/records", recordRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`ASTRA backend running at http://localhost:${PORT}`);
});

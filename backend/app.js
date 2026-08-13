const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load Environment Variables
dotenv.config();

// Import Database Connection
const db = require("./config/db");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const detectionRoutes = require("./routes/detectionRoutes");
const cameraRoutes = require("./routes/cameraRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload Folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Default Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to VisionEdge Backend API"
    });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/detection", detectionRoutes);
app.use("/api/cameras", cameraRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API Route Not Found"
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
});

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
    console.log(`VisionEdge Backend Running on http://localhost:${PORT}`);
});

const express = require("express");

const router = express.Router();

const detectionController =
    require("../controllers/detectionController");

const authenticateToken =
    require("../middleware/authMiddleware");


// Run AI detection
router.post(
    "/run",
    authenticateToken,
    detectionController.runDetection
);


// Get detection logs
router.get(
    "/logs",
    authenticateToken,
    detectionController.getLogs
);


module.exports = router;
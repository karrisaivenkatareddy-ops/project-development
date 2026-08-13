const express = require("express");

const router = express.Router();

const cameraController = require("../controllers/cameraController");

const authenticateToken = require("../middleware/authMiddleware");


// Get all cameras
router.get(
    "/",
    authenticateToken,
    cameraController.getCameras
);


// Get one camera
router.get(
    "/:id",
    authenticateToken,
    cameraController.getCameraById
);


// Add camera
router.post(
    "/",
    authenticateToken,
    cameraController.addCamera
);


// Update camera
router.put(
    "/:id",
    authenticateToken,
    cameraController.updateCamera
);


// Delete camera
router.delete(
    "/:id",
    authenticateToken,
    cameraController.deleteCamera
);


module.exports = router;
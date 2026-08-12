const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

const authenticateToken = require("../middleware/authMiddleware");

// Register
router.post(
    "/register",
    authController.register
);

// Login
router.post(
    "/login",
    authController.login
);

// Current logged-in user
router.get(
    "/me",
    authenticateToken,
    authController.getMe
);

module.exports = router;
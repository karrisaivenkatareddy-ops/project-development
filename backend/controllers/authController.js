const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// ===============================
// REGISTER
// ===============================
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters"
            });
        }

        // Check whether email already exists
        const checkQuery = "SELECT id FROM users WHERE email = ?";

        db.query(checkQuery, [email], async (err, results) => {
            if (err) {
                console.error("Database Error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (results.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: "Email already registered"
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user
            const insertQuery = `
                INSERT INTO users (name, email, password)
                VALUES (?, ?, ?)
            `;

            db.query(
                insertQuery,
                [name, email, hashedPassword],
                (err, result) => {
                    if (err) {
                        console.error("Registration Error:", err);

                        return res.status(500).json({
                            success: false,
                            message: "Unable to register user"
                        });
                    }

                    return res.status(201).json({
                        success: true,
                        message: "User registered successfully",
                        user: {
                            id: result.insertId,
                            name,
                            email
                        }
                    });
                }
            );
        });

    } catch (error) {
        console.error("Register Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// ===============================
// LOGIN
// ===============================
exports.login = (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    // Find user
    const query = `
        SELECT id, name, email, password
        FROM users
        WHERE email = ?
    `;

    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error("Login Database Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        // User doesn't exist
        if (results.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = results[0];

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    });
};


// ===============================
// GET CURRENT USER
// ===============================
exports.getMe = (req, res) => {
    const userId = req.user.id;

    const query = `
        SELECT id, name, email, created_at
        FROM users
        WHERE id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Get User Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user: results[0]
        });
    });
};
const db = require("../config/db");

// ========================================
// GET ALL CAMERAS
// ========================================
exports.getCameras = (req, res) => {

    const query = `
        SELECT id, name, source, type, status, created_at
        FROM cameras
        ORDER BY id DESC
    `;

    db.query(query, (err, results) => {

        if (err) {
            console.error("Get Cameras Error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch cameras"
            });
        }

        res.status(200).json({
            success: true,
            count: results.length,
            cameras: results
        });
    });
};


// ========================================
// GET SINGLE CAMERA
// ========================================
exports.getCameraById = (req, res) => {

    const cameraId = req.params.id;

    const query = `
        SELECT id, name, source, type, status, created_at
        FROM cameras
        WHERE id = ?
    `;

    db.query(query, [cameraId], (err, results) => {

        if (err) {
            console.error("Get Camera Error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch camera"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Camera not found"
            });
        }

        res.status(200).json({
            success: true,
            camera: results[0]
        });
    });
};


// ========================================
// ADD CAMERA
// ========================================
exports.addCamera = (req, res) => {

    const {
        name,
        source,
        type
    } = req.body;

    if (!name || !source || !type) {
        return res.status(400).json({
            success: false,
            message: "Name, source and type are required"
        });
    }

    const allowedTypes = [
        "webcam",
        "rtsp",
        "video"
    ];

    if (!allowedTypes.includes(type)) {
        return res.status(400).json({
            success: false,
            message: "Invalid camera type"
        });
    }

    const query = `
        INSERT INTO cameras
        (name, source, type, status)
        VALUES (?, ?, ?, 'inactive')
    `;

    db.query(
        query,
        [name, source, type],
        (err, result) => {

            if (err) {
                console.error("Add Camera Error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to add camera"
                });
            }

            res.status(201).json({
                success: true,
                message: "Camera added successfully",
                camera: {
                    id: result.insertId,
                    name,
                    source,
                    type,
                    status: "inactive"
                }
            });
        }
    );
};


// ========================================
// UPDATE CAMERA
// ========================================
exports.updateCamera = (req, res) => {

    const cameraId = req.params.id;

    const {
        name,
        source,
        type,
        status
    } = req.body;

    const allowedTypes = [
        "webcam",
        "rtsp",
        "video"
    ];

    const allowedStatus = [
        "active",
        "inactive"
    ];

    if (type && !allowedTypes.includes(type)) {
        return res.status(400).json({
            success: false,
            message: "Invalid camera type"
        });
    }

    if (status && !allowedStatus.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid camera status"
        });
    }

    const query = `
        UPDATE cameras
        SET
            name = COALESCE(?, name),
            source = COALESCE(?, source),
            type = COALESCE(?, type),
            status = COALESCE(?, status)
        WHERE id = ?
    `;

    db.query(
        query,
        [
            name || null,
            source || null,
            type || null,
            status || null,
            cameraId
        ],
        (err, result) => {

            if (err) {
                console.error("Update Camera Error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update camera"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Camera not found"
                });
            }

            res.status(200).json({
                success: true,
                message: "Camera updated successfully"
            });
        }
    );
};


// ========================================
// DELETE CAMERA
// ========================================
exports.deleteCamera = (req, res) => {

    const cameraId = req.params.id;

    const query = `
        DELETE FROM cameras
        WHERE id = ?
    `;

    db.query(query, [cameraId], (err, result) => {

        if (err) {
            console.error("Delete Camera Error:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to delete camera"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Camera not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Camera deleted successfully"
        });
    });
};
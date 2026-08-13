import { useEffect, useState } from "react";
import "./index.css";

const API_BASE = "/api";

function App() {
    const [page, setPage] = useState("dashboard");
    const [token, setToken] = useState(
        localStorage.getItem("visionedge_token")
    );

    const [user, setUser] = useState(null);

    const [cameras, setCameras] = useState([]);
    const [detections, setDetections] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [cameraName, setCameraName] = useState("");
    const [cameraSource, setCameraSource] = useState("");
    const [cameraType, setCameraType] = useState("video");

    const [showAddCamera, setShowAddCamera] = useState(false);

    // ==========================================
    // LOGIN
    // ==========================================

    const login = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Login failed"
                );
            }

            localStorage.setItem(
                "visionedge_token",
                data.token
            );

            setToken(data.token);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // LOGOUT
    // ==========================================

    const logout = () => {
        localStorage.removeItem("visionedge_token");

        setToken(null);
        setUser(null);
        setCameras([]);
        setDetections([]);
    };

    // ==========================================
    // AUTH HEADER
    // ==========================================

    const getHeaders = () => ({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    });

    // ==========================================
    // LOAD USER
    // ==========================================

    const loadUser = async () => {
        try {
            const response = await fetch(
                `${API_BASE}/auth/me`,
                {
                    headers: getHeaders()
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                logout();
                return;
            }

            setUser(data.user);

        } catch (err) {
            console.error(err);
        }
    };

    // ==========================================
    // LOAD CAMERAS
    // ==========================================

    const loadCameras = async () => {
        try {
            const response = await fetch(
                `${API_BASE}/cameras`,
                {
                    headers: getHeaders()
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to load cameras"
                );
            }

            setCameras(data.cameras || []);

        } catch (err) {
            setError(err.message);
        }
    };

    // ==========================================
    // LOAD DETECTION LOGS
    // ==========================================

    const loadDetections = async () => {
        try {
            const response = await fetch(
                `${API_BASE}/detection/logs`,
                {
                    headers: getHeaders()
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Failed to load detection logs"
                );
            }

            setDetections(data.detections || []);

        } catch (err) {
            setError(err.message);
        }
    };

    // ==========================================
    // ADD CAMERA
    // ==========================================

    const addCamera = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `${API_BASE}/cameras`,
                {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify({
                        name: cameraName,
                        source: cameraSource,
                        type: cameraType
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Failed to add camera"
                );
            }

            setCameraName("");
            setCameraSource("");
            setCameraType("video");

            setShowAddCamera(false);

            await loadCameras();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // START DETECTION
    // ==========================================

    const startDetection = async (cameraId) => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `${API_BASE}/detection/run`,
                {
                    method: "POST",
                    headers: getHeaders(),
                    body: JSON.stringify({
                        camera_id: cameraId
                    })
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "AI detection failed"
                );
            }

            alert(
                `AI detection completed successfully.\n\n` +
                `Detections: ${data.detections_found}\n` +
                `Database records: ${data.database_records}`
            );

            await loadCameras();
            await loadDetections();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // INITIAL DATA
    // ==========================================

    useEffect(() => {
        if (!token) return;

        loadUser();
        loadCameras();
        loadDetections();
    }, [token]);

    // ==========================================
    // AUTO REFRESH DETECTIONS
    // ==========================================

    useEffect(() => {
        if (!token) return;

        const interval = setInterval(() => {
            loadDetections();
            loadCameras();
        }, 10000);

        return () => clearInterval(interval);
    }, [token]);

    // ==========================================
    // LOGIN PAGE
    // ==========================================

    if (!token) {
        return (
            <div className="login-page">

                <div className="login-card">

                    <div className="brand">
                        <div className="brand-icon">
                            VE
                        </div>

                        <div>
                            <h1>VisionEdge</h1>
                            <p>AI Video Intelligence</p>
                        </div>
                    </div>

                    <div className="login-heading">
                        <h2>Welcome back</h2>
                        <p>
                            Sign in to access the VisionEdge
                            monitoring platform.
                        </p>
                    </div>

                    {error && (
                        <div className="error-box">
                            {error}
                        </div>
                    )}

                    <form onSubmit={login}>

                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                        <button
                            className="primary-button login-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign In"}
                        </button>

                    </form>

                    <div className="login-footer">
                        VisionEdge AI Detection Platform
                    </div>

                </div>

            </div>
        );
    }

    // ==========================================
    // DASHBOARD CALCULATIONS
    // ==========================================

    const totalCameras = cameras.length;

    const activeCameras = cameras.filter(
        (camera) => camera.status === "active"
    ).length;

    const totalDetections = detections.length;

    const uniqueObjects = new Set(
        detections.map(
            (item) => item.object_name
        )
    ).size;

    // ==========================================
    // MAIN APPLICATION
    // ==========================================

    return (
        <div className="app">

            {/* SIDEBAR */}

            <aside className="sidebar">

                <div className="sidebar-brand">

                    <div className="brand-icon small">
                        VE
                    </div>

                    <div>
                        <strong>VisionEdge</strong>
                        <span>AI Monitoring</span>
                    </div>

                </div>

                <nav>

                    <button
                        className={
                            page === "dashboard"
                                ? "nav-item active"
                                : "nav-item"
                        }
                        onClick={() =>
                            setPage("dashboard")
                        }
                    >
                        <span>▦</span>
                        Dashboard
                    </button>

                    <button
                        className={
                            page === "cameras"
                                ? "nav-item active"
                                : "nav-item"
                        }
                        onClick={() =>
                            setPage("cameras")
                        }
                    >
                        <span>▣</span>
                        Cameras
                    </button>

                    <button
                        className={
                            page === "detections"
                                ? "nav-item active"
                                : "nav-item"
                        }
                        onClick={() =>
                            setPage("detections")
                        }
                    >
                        <span>◉</span>
                        Detection Logs
                    </button>

                </nav>

                <div className="sidebar-bottom">

                    <div className="user-card">

                        <div className="avatar">
                            {user?.name
                                ?.charAt(0)
                                ?.toUpperCase() || "U"}
                        </div>

                        <div className="user-info">
                            <strong>
                                {user?.name || "User"}
                            </strong>

                            <span>
                                {user?.email || ""}
                            </span>
                        </div>

                    </div>

                    <button
                        className="logout-button"
                        onClick={logout}
                    >
                        Sign Out
                    </button>

                </div>

            </aside>

            {/* MAIN */}

            <main className="main">

                <header className="topbar">

                    <div>
                        <h2>
                            {page === "dashboard"
                                ? "Dashboard"
                                : page === "cameras"
                                    ? "Camera Management"
                                    : "Detection Logs"}
                        </h2>

                        <p>
                            VisionEdge real-time monitoring
                            platform
                        </p>
                    </div>

                    <div className="system-status">
                        <span className="status-dot"></span>
                        System Online
                    </div>

                </header>

                {error && (
                    <div className="error-box main-error">
                        {error}

                        <button
                            onClick={() =>
                                setError("")
                            }
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* ====================================
                    DASHBOARD
                ==================================== */}

                {page === "dashboard" && (

                    <section>

                        <div className="stats-grid">

                            <div className="stat-card">

                                <div className="stat-icon">
                                    ▣
                                </div>

                                <div>
                                    <span>
                                        Total Cameras
                                    </span>

                                    <strong>
                                        {totalCameras}
                                    </strong>
                                </div>

                            </div>

                            <div className="stat-card">

                                <div className="stat-icon green">
                                    ●
                                </div>

                                <div>
                                    <span>
                                        Active Cameras
                                    </span>

                                    <strong>
                                        {activeCameras}
                                    </strong>
                                </div>

                            </div>

                            <div className="stat-card">

                                <div className="stat-icon purple">
                                    ◉
                                </div>

                                <div>
                                    <span>
                                        Total Detections
                                    </span>

                                    <strong>
                                        {totalDetections}
                                    </strong>
                                </div>

                            </div>

                            <div className="stat-card">

                                <div className="stat-icon orange">
                                    ✦
                                </div>

                                <div>
                                    <span>
                                        Object Types
                                    </span>

                                    <strong>
                                        {uniqueObjects}
                                    </strong>
                                </div>

                            </div>

                        </div>

                        <div className="content-grid">

                            <div className="panel">

                                <div className="panel-header">

                                    <div>
                                        <h3>
                                            Camera Overview
                                        </h3>

                                        <p>
                                            Connected video sources
                                        </p>
                                    </div>

                                    <button
                                        className="secondary-button"
                                        onClick={() =>
                                            setPage("cameras")
                                        }
                                    >
                                        View All
                                    </button>

                                </div>

                                {cameras.length === 0 ? (

                                    <div className="empty-state">
                                        No cameras configured.
                                    </div>

                                ) : (

                                    <div className="camera-list">

                                        {cameras
                                            .slice(0, 5)
                                            .map((camera) => (

                                                <div
                                                    className="camera-row"
                                                    key={camera.id}
                                                >

                                                    <div className="camera-symbol">
                                                        ▣
                                                    </div>

                                                    <div className="camera-details">

                                                        <strong>
                                                            {camera.name}
                                                        </strong>

                                                        <span>
                                                            {camera.type.toUpperCase()}
                                                        </span>

                                                    </div>

                                                    <span
                                                        className={
                                                            camera.status === "active"
                                                                ? "badge active"
                                                                : "badge inactive"
                                                        }
                                                    >
                                                        {camera.status}
                                                    </span>

                                                </div>

                                            ))}

                                    </div>

                                )}

                            </div>

                            <div className="panel">

                                <div className="panel-header">

                                    <div>
                                        <h3>
                                            Recent Detections
                                        </h3>

                                        <p>
                                            Latest AI results
                                        </p>
                                    </div>

                                    <button
                                        className="secondary-button"
                                        onClick={() =>
                                            setPage("detections")
                                        }
                                    >
                                        View All
                                    </button>

                                </div>

                                {detections.length === 0 ? (

                                    <div className="empty-state">
                                        No detections available.
                                    </div>

                                ) : (

                                    <div className="detection-list">

                                        {detections
                                            .slice(0, 8)
                                            .map((item) => (

                                                <div
                                                    className="detection-row"
                                                    key={item.id}
                                                >

                                                    <div className="object-icon">
                                                        ◉
                                                    </div>

                                                    <div className="detection-details">

                                                        <strong>
                                                            {item.object_name}
                                                        </strong>

                                                        <span>
                                                            Camera #{item.camera_id}
                                                        </span>

                                                    </div>

                                                    <div className="confidence">

                                                        {(Number(
                                                            item.confidence
                                                        ) * 100).toFixed(0)}%

                                                    </div>

                                                </div>

                                            ))}

                                    </div>

                                )}

                            </div>

                        </div>

                    </section>

                )}

                {/* ====================================
                    CAMERAS
                ==================================== */}

                {page === "cameras" && (

                    <section>

                        <div className="page-actions">

                            <div>
                                <h3>
                                    Connected Cameras
                                </h3>

                                <p>
                                    Manage video sources used
                                    by the AI detection engine.
                                </p>
                            </div>

                            <button
                                className="primary-button"
                                onClick={() =>
                                    setShowAddCamera(true)
                                }
                            >
                                + Add Camera
                            </button>

                        </div>

                        <div className="camera-grid">

                            {cameras.map((camera) => (

                                <div
                                    className="camera-card"
                                    key={camera.id}
                                >

                                    <div className="camera-preview">
                                        <span>VISIONEDGE</span>
                                    </div>

                                    <div className="camera-card-body">

                                        <div className="camera-card-title">

                                            <div>
                                                <h3>
                                                    {camera.name}
                                                </h3>

                                                <span>
                                                    Camera #{camera.id}
                                                </span>
                                            </div>

                                            <span
                                                className={
                                                    camera.status === "active"
                                                        ? "badge active"
                                                        : "badge inactive"
                                                }
                                            >
                                                {camera.status}
                                            </span>

                                        </div>

                                        <div className="source">
                                            <span>Source</span>
                                            <strong>
                                                {camera.source}
                                            </strong>
                                        </div>

                                        <div className="source">
                                            <span>Type</span>
                                            <strong>
                                                {camera.type}
                                            </strong>
                                        </div>

                                        <button
                                            className="primary-button full"
                                            onClick={() =>
                                                startDetection(
                                                    camera.id
                                                )
                                            }
                                            disabled={loading}
                                        >
                                            {loading
                                                ? "Processing..."
                                                : "Start AI Detection"}
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                        {cameras.length === 0 && (
                            <div className="empty-large">
                                <h3>
                                    No cameras found
                                </h3>

                                <p>
                                    Add a camera to start
                                    VisionEdge detection.
                                </p>
                            </div>
                        )}

                    </section>

                )}

                {/* ====================================
                    DETECTION LOGS
                ==================================== */}

                {page === "detections" && (

                    <section>

                        <div className="page-actions">

                            <div>
                                <h3>
                                    Detection History
                                </h3>

                                <p>
                                    Real detection records
                                    retrieved from MySQL.
                                </p>
                            </div>

                            <button
                                className="secondary-button"
                                onClick={loadDetections}
                            >
                                Refresh
                            </button>

                        </div>

                        <div className="table-container">

                            <table>

                                <thead>

                                    <tr>
                                        <th>ID</th>
                                        <th>Camera</th>
                                        <th>Object</th>
                                        <th>Confidence</th>
                                        <th>Timestamp</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {detections.map(
                                        (item) => (

                                            <tr key={item.id}>

                                                <td>
                                                    #{item.id}
                                                </td>

                                                <td>
                                                    Camera #
                                                    {item.camera_id}
                                                </td>

                                                <td>
                                                    <span className="object-label">
                                                        {item.object_name}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="confidence-cell">

                                                        <span>
                                                            {(Number(
                                                                item.confidence
                                                            ) * 100).toFixed(1)}%
                                                        </span>

                                                        <div className="confidence-bar">

                                                            <div
                                                                style={{
                                                                    width:
                                                                        `${Math.min(
                                                                            Number(
                                                                                item.confidence
                                                                            ) * 100,
                                                                            100
                                                                        )}%`
                                                                }}
                                                            ></div>

                                                        </div>

                                                    </div>
                                                </td>

                                                <td>
                                                    {item.timestamp}
                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                            {detections.length === 0 && (
                                <div className="empty-state">
                                    No detection records found.
                                </div>
                            )}

                        </div>

                    </section>

                )}

            </main>

            {/* ========================================
                ADD CAMERA MODAL
            ======================================== */}

            {showAddCamera && (

                <div
                    className="modal-overlay"
                    onClick={() =>
                        setShowAddCamera(false)
                    }
                >

                    <div
                        className="modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>
                                <h2>
                                    Add Camera
                                </h2>

                                <p>
                                    Register a new video
                                    source.
                                </p>
                            </div>

                            <button
                                className="close-button"
                                onClick={() =>
                                    setShowAddCamera(false)
                                }
                            >
                                ×
                            </button>

                        </div>

                        <form onSubmit={addCamera}>

                            <label>
                                Camera Name
                            </label>

                            <input
                                value={cameraName}
                                onChange={(e) =>
                                    setCameraName(
                                        e.target.value
                                    )
                                }
                                placeholder="e.g. Traffic Camera 01"
                                required
                            />

                            <label>
                                Source
                            </label>

                            <input
                                value={cameraSource}
                                onChange={(e) =>
                                    setCameraSource(
                                        e.target.value
                                    )
                                }
                                placeholder="input/sample.mp4 or RTSP URL"
                                required
                            />

                            <label>
                                Camera Type
                            </label>

                            <select
                                value={cameraType}
                                onChange={(e) =>
                                    setCameraType(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="video">
                                    Video File
                                </option>

                                <option value="rtsp">
                                    RTSP Stream
                                </option>

                                <option value="webcam">
                                    Webcam
                                </option>

                            </select>

                            <button
                                className="primary-button full"
                                disabled={loading}
                            >
                                {loading
                                    ? "Adding..."
                                    : "Add Camera"}
                            </button>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default App;
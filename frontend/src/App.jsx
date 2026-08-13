import { useEffect, useRef, useState } from "react";

import {
  Activity,
  Camera,
  CheckCircle,
  ChevronDown,
  Cpu,
  Gauge,
  HardDrive,
  Menu,
  Play,
  Radio,
  Server,
  Settings,
  Square,
  Upload,
  Video,
  Wifi,
  WifiOff,
  X,
  Zap
} from "lucide-react";


const cameras = [
  {
    id: "CAM-001",
    name: "Intersection Camera 01",
    location: "Main Road",
    status: "online"
  },
  {
    id: "CAM-002",
    name: "Intersection Camera 02",
    location: "Central Junction",
    status: "online"
  },
  {
    id: "CAM-003",
    name: "Intersection Camera 03",
    location: "Market Road",
    status: "online"
  },
  {
    id: "CAM-004",
    name: "Intersection Camera 04",
    location: "Highway Entry",
    status: "offline"
  }
];


function App() {
  const videoRef = useRef(null);

  const [selectedCamera, setSelectedCamera] = useState(cameras[0]);

  const [streaming, setStreaming] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [modelName, setModelName] = useState("YOLO TensorRT Engine");

  const [modelFile, setModelFile] = useState(null);

  const [connectionStatus, setConnectionStatus] = useState("Ready");

  const [metrics, setMetrics] = useState({
    fps: 58,
    gpuMemory: 62,
    gpuUtilization: 91,
    decoderUtilization: 74,
    latency: 42,
    objects: 8
  });


  /*
   * Simulated telemetry.
   *
   * Later this section can be replaced with
   * WebSocket/WebRTC data from the Python backend.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((previous) => ({
        ...previous,

        fps: Math.max(
          45,
          Math.min(60, previous.fps + randomNumber(-2, 2))
        ),

        gpuMemory: Math.max(
          45,
          Math.min(85, previous.gpuMemory + randomNumber(-2, 2))
        ),

        gpuUtilization: Math.max(
          60,
          Math.min(98, previous.gpuUtilization + randomNumber(-3, 3))
        ),

        decoderUtilization: Math.max(
          50,
          Math.min(95, previous.decoderUtilization + randomNumber(-3, 3))
        ),

        latency: Math.max(
          25,
          Math.min(80, previous.latency + randomNumber(-3, 3))
        ),

        objects: Math.max(
          1,
          Math.min(20, previous.objects + randomNumber(-2, 2))
        )
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, []);


  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  function startStream() {
    if (selectedCamera.status === "offline") {
      setConnectionStatus("Camera offline");
      return;
    }

    setStreaming(true);
    setConnectionStatus("Connected");
  }


  function stopStream() {
    setStreaming(false);
    setConnectionStatus("Ready");
  }


  function selectCamera(camera) {
    setSelectedCamera(camera);

    if (camera.status === "offline") {
      setStreaming(false);
      setConnectionStatus("Camera offline");
    } else {
      setConnectionStatus("Ready");
    }
  }


  function handleModelUpload(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setModelFile(file);
    setModelName(file.name);
  }


  function uploadModel() {
    if (!modelFile) {
      alert("Please select a TensorRT engine file first.");
      return;
    }

    alert(
      `Selected TensorRT engine: ${modelFile.name}\n\nBackend API integration will upload this file to Python later.`
    );
  }


  return (
    <div className="app">


      {/* Mobile overlay */}

      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      {/* Sidebar */}

      <aside
        className={`sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >

        <div className="sidebar-header">

          <div className="brand-icon">
            <Zap size={22} />
          </div>

          <div>
            <h1>VisionEdge</h1>
            <p>AI Video Pipeline</p>
          </div>

          <button
            className="mobile-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>

        </div>


        <div className="sidebar-section">

          <div className="section-title">
            <span>CAMERAS</span>

            <span className="camera-count">
              {cameras.length}
            </span>
          </div>


          <div className="camera-list">

            {cameras.map((camera) => (

              <button
                key={camera.id}
                className={`camera-item ${
                  selectedCamera.id === camera.id
                    ? "camera-active"
                    : ""
                }`}
                onClick={() => selectCamera(camera)}
              >

                <div className="camera-icon">
                  <Camera size={18} />
                </div>

                <div className="camera-info">

                  <strong>{camera.name}</strong>

                  <span>{camera.location}</span>

                  <small
                    className={
                      camera.status === "online"
                        ? "status-online"
                        : "status-offline"
                    }
                  >
                    <span className="status-dot" />
                    {camera.status}
                  </small>

                </div>

              </button>

            ))}

          </div>

        </div>


        <div className="sidebar-section model-section">

          <div className="section-title">
            <span>AI MODEL</span>
          </div>


          <div className="model-card">

            <div className="model-icon">
              <Cpu size={20} />
            </div>

            <div className="model-info">

              <strong>TensorRT</strong>

              <span>{modelName}</span>

            </div>

          </div>


          <label className="upload-button">

            <Upload size={16} />

            Choose Engine

            <input
              type="file"
              accept=".engine"
              onChange={handleModelUpload}
            />

          </label>


          {modelFile && (
            <button
              className="load-model-button"
              onClick={uploadModel}
            >
              <Zap size={15} />
              Load TensorRT Engine
            </button>
          )}

        </div>


        <div className="sidebar-bottom">

          <div className="system-mini">

            <div className="system-mini-icon">
              <Server size={17} />
            </div>

            <div>
              <strong>Edge Server</strong>

              <span>
                NVIDIA GPU
              </span>
            </div>

            <span className="online-indicator" />

          </div>

        </div>

      </aside>


      {/* Main */}

      <main className="main">


        {/* Topbar */}

        <header className="topbar">

          <div className="topbar-left">

            <button
              className="menu-button"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={21} />
            </button>

            <div>

              <div className="breadcrumb">
                Monitoring
                <span>/</span>
                {selectedCamera.id}
              </div>

              <h2>{selectedCamera.name}</h2>

            </div>

          </div>


          <div className="topbar-right">

            <div className="connection-status">

              {connectionStatus === "Connected" ? (
                <Wifi size={17} />
              ) : (
                <WifiOff size={17} />
              )}

              <span>{connectionStatus}</span>

            </div>

            <button className="settings-button">
              <Settings size={19} />
            </button>

          </div>

        </header>


        {/* Content */}

        <div className="content">


          {/* Page heading */}

          <div className="page-heading">

            <div>

              <p className="eyebrow">
                REAL-TIME EDGE AI
              </p>

              <h3>
                Video Pipeline
              </h3>

              <p>
                Monitor hardware-accelerated video
                processing in real time.
              </p>

            </div>


            <div className="stream-controls">

              {!streaming ? (

                <button
                  className="primary-button"
                  onClick={startStream}
                >
                  <Play size={17} />
                  Start Stream
                </button>

              ) : (

                <button
                  className="stop-button"
                  onClick={stopStream}
                >
                  <Square size={15} />
                  Stop Stream
                </button>

              )}

            </div>

          </div>


          {/* Video + side information */}

          <section className="video-section">


            <div className="video-card">

              <div className="video-header">

                <div className="video-title">

                  <span className="live-dot" />

                  <strong>LIVE</strong>

                  <span className="video-camera-name">
                    {selectedCamera.id}
                  </span>

                </div>


                <div className="video-header-right">

                  <span>
                    1920 × 1080
                  </span>

                  <span>
                    60 FPS
                  </span>

                </div>

              </div>


              <div className="video-container">

                {streaming ? (

                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="video-element"
                  />

                ) : (

                  <div className="video-placeholder">

                    <div className="placeholder-icon">
                      <Video size={38} />
                    </div>

                    <h4>
                      Stream not started
                    </h4>

                    <p>
                      Start the stream to view the
                      processed video feed.
                    </p>

                    <button
                      className="placeholder-button"
                      onClick={startStream}
                    >
                      <Play size={16} />
                      Start Stream
                    </button>

                  </div>

                )}


                {streaming && (
                  <>

                    <div className="video-overlay-top">

                      <span>
                        {selectedCamera.id}
                      </span>

                      <span>
                        {metrics.fps} FPS
                      </span>

                    </div>


                    {/* Simulated detection boxes */}

                    <div className="detection-box car-box">
                      <span>car 0.96</span>
                    </div>

                    <div className="detection-box person-box">
                      <span>person 0.92</span>
                    </div>

                    <div className="detection-box truck-box">
                      <span>truck 0.88</span>
                    </div>

                  </>
                )}

              </div>


              <div className="video-footer">

                <div>
                  <Radio size={15} />
                  RTSP Input
                </div>

                <div>
                  <Zap size={15} />
                  TensorRT
                </div>

                <div>
                  <Activity size={15} />
                  WebRTC
                </div>

              </div>

            </div>


            {/* Pipeline status */}

            <div className="pipeline-card">

              <div className="card-heading">

                <div>
                  <span className="card-label">
                    PIPELINE
                  </span>

                  <h4>
                    Processing Status
                  </h4>
                </div>

                <CheckCircle
                  size={20}
                  className="success-icon"
                />

              </div>


              <div className="pipeline">

                <PipelineStep
                  icon={<Camera size={18} />}
                  title="RTSP Input"
                  subtitle="Video source"
                  active={streaming}
                />

                <div className="pipeline-line" />

                <PipelineStep
                  icon={<Cpu size={18} />}
                  title="NVDEC"
                  subtitle="GPU Decoder"
                  active={streaming}
                />

                <div className="pipeline-line" />

                <PipelineStep
                  icon={<Zap size={18} />}
                  title="TensorRT"
                  subtitle="AI Inference"
                  active={streaming}
                />

                <div className="pipeline-line" />

                <PipelineStep
                  icon={<Radio size={18} />}
                  title="WebRTC"
                  subtitle="Browser Stream"
                  active={streaming}
                />

              </div>


              <div className="pipeline-footer">

                <span>Pipeline latency</span>

                <strong>
                  {metrics.latency} ms
                </strong>

              </div>

            </div>

          </section>


          {/* Metrics */}

          <section className="metrics-section">

            <div className="section-heading">

              <div>
                <span className="card-label">
                  TELEMETRY
                </span>

                <h4>
                  GPU & Stream Metrics
                </h4>
              </div>

              <span className="refresh-label">
                Live updates
                <span className="pulse-dot" />
              </span>

            </div>


            <div className="metrics-grid">

              <MetricCard
                icon={<Gauge size={20} />}
                title="Stream FPS"
                value={metrics.fps}
                unit="FPS"
                description="Current throughput"
              />

              <MetricCard
                icon={<HardDrive size={20} />}
                title="GPU Memory"
                value={metrics.gpuMemory}
                unit="%"
                description="VRAM utilization"
                progress={metrics.gpuMemory}
              />

              <MetricCard
                icon={<Cpu size={20} />}
                title="GPU Utilization"
                value={metrics.gpuUtilization}
                unit="%"
                description="Compute utilization"
                progress={metrics.gpuUtilization}
              />

              <MetricCard
                icon={<Activity size={20} />}
                title="Decoder"
                value={metrics.decoderUtilization}
                unit="%"
                description="NVDEC utilization"
                progress={metrics.decoderUtilization}
              />

            </div>

          </section>


          {/* Bottom information */}

          <section className="bottom-grid">


            <div className="info-card">

              <div className="card-heading">

                <div>

                  <span className="card-label">
                    AI INFERENCE
                  </span>

                  <h4>
                    Detection Summary
                  </h4>

                </div>

                <Zap
                  size={20}
                  className="accent-icon"
                />

              </div>


              <div className="detection-summary">

                <div className="object-count">

                  <strong>
                    {metrics.objects}
                  </strong>

                  <span>
                    Objects detected
                  </span>

                </div>


                <div className="detection-list">

                  <div>
                    <span className="object-dot car" />
                    <span>Cars</span>
                    <strong>5</strong>
                  </div>

                  <div>
                    <span className="object-dot person" />
                    <span>Persons</span>
                    <strong>2</strong>
                  </div>

                  <div>
                    <span className="object-dot truck" />
                    <span>Trucks</span>
                    <strong>1</strong>
                  </div>

                </div>

              </div>

            </div>


            <div className="info-card">

              <div className="card-heading">

                <div>

                  <span className="card-label">
                    MODEL
                  </span>

                  <h4>
                    Active Engine
                  </h4>

                </div>

                <ChevronDown size={18} />

              </div>


              <div className="active-model">

                <div className="active-model-icon">
                  <Cpu size={24} />
                </div>

                <div>

                  <strong>
                    {modelName}
                  </strong>

                  <span>
                    Optimized TensorRT Engine
                  </span>

                </div>

                <span className="model-status">
                  ACTIVE
                </span>

              </div>


              <div className="model-stats">

                <div>
                  <span>Precision</span>
                  <strong>FP16</strong>
                </div>

                <div>
                  <span>Inference</span>
                  <strong>GPU</strong>
                </div>

                <div>
                  <span>Latency</span>
                  <strong>{metrics.latency} ms</strong>
                </div>

              </div>

            </div>

          </section>


          <footer className="footer">

            <span>
              VisionEdge
            </span>

            <span>
              Hardware-Accelerated Video Pipeline
            </span>

            <span>
              System Ready
            </span>

          </footer>

        </div>

      </main>

    </div>
  );
}


/* ------------------------------
   Pipeline Component
-------------------------------- */

function PipelineStep({
  icon,
  title,
  subtitle,
  active
}) {
  return (
    <div
      className={`pipeline-step ${
        active ? "pipeline-active" : ""
      }`}
    >

      <div className="pipeline-icon">
        {icon}
      </div>

      <div>
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>

    </div>
  );
}


/* ------------------------------
   Metric Component
-------------------------------- */

function MetricCard({
  icon,
  title,
  value,
  unit,
  description,
  progress
}) {
  return (
    <div className="metric-card">

      <div className="metric-top">

        <div className="metric-icon">
          {icon}
        </div>

        <span className="metric-title">
          {title}
        </span>

      </div>


      <div className="metric-value">

        <strong>
          {value}
        </strong>

        <span>
          {unit}
        </span>

      </div>


      <p>
        {description}
      </p>


      {progress !== undefined && (
        <div className="progress-container">

          <div className="progress-track">

            <div
              className="progress-value"
              style={{
                width: `${progress}%`
              }}
            />

          </div>

        </div>
      )}

    </div>
  );
}


export default App;
const express = require("express");

const router = express.Router();

const cameraController = require("../controllers/cameraController");

router.get("/",cameraController.getCameras);

router.post("/add",cameraController.addCamera);

module.exports=router;
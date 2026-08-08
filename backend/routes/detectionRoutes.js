const express=require("express");

const router=express.Router();

const detectionController=require("../controllers/detectionController");

router.post("/run",detectionController.runDetection);

router.get("/logs",detectionController.getLogs);

module.exports=router;
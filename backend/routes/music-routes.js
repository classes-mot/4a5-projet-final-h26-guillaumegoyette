import express from "express";
import musicController from "../controllers/music-controller.js";
import checkAuth from "../middleware/check-auth.js";
import fileUpload from "../middleware/fileUpload.js";

const router = express.Router();

router.use(checkAuth);

router.post("/send", fileUpload.single("audio"), musicController.sendMusic);

export default router;

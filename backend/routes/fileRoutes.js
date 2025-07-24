import express from "express";
import multer from "multer";
import { filesStorage } from "../middlewares/uploadFiles.js";
import { processResumes } from "../controllers/fileUploadController.js";

const router = express.Router();
const upload = multer({ storage: filesStorage });

router.post("/upload-resumes", upload.array("files", 10), processResumes);

export default router;

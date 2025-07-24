import express from "express";
import {
  deleteAccountController,
  loginHRController,
  registerHRController,
} from "../controllers/recruiterController.js";
import { requireSignin } from "../middlewares/userMiddleware.js";
const router = express.Router();

router.post("/signup", registerHRController);

router.post("/login", loginHRController);

router.delete("/delete-account", requireSignin, deleteAccountController);

export default router;

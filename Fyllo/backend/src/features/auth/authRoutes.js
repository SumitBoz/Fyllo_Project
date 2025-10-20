import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
} from "./auth.Controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/refresh-token", refreshToken);

export default router;

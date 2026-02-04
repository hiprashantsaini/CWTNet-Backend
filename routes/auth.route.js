import express from "express";
import { getCurrentUser, googleSignIn, login, logout, resetPassword, sendOtp, sendOtpForEmail, signup, verifyOtpForEmail } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/send-otp", sendOtpForEmail);
router.post("/verify-otp", verifyOtpForEmail);
router.post("/google-signin", googleSignIn);
router.post("/login", login);
router.post("/logout", logout);

router.post('/sendOtp',sendOtp);
router.post('/resetPassword',resetPassword);

router.get("/me", protectRoute, getCurrentUser);

export default router;

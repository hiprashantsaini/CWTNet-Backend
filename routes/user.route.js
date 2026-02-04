import express from "express";
import { getPublicProfile, getSuggestedConnections, updateBanner, updateProfileImage, updateProfileInfo } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/suggestions", protectRoute, getSuggestedConnections);

router.get("/:username", protectRoute, getPublicProfile);

///Start profile according to figma
router.post("/changeBanner",protectRoute,updateBanner);
router.post("/changeProfileImage",protectRoute,updateProfileImage);
router.post("/updateProfile",protectRoute,updateProfileInfo)




export default router;

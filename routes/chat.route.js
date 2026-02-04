import express from "express";
import { accessChat, createGroupChat, fetchChats } from "../controllers/chat.controller.js";

import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/",protectRoute ,accessChat);
router.post('/createGroup',protectRoute, createGroupChat);
router.get('/allChats',protectRoute, fetchChats);//Either one-to-one or groups chat means groups

export default router;

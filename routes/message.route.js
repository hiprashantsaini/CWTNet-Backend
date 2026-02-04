import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { addMessage, deleteMessage, getMessages, updateMessage } from "../models/message.controller.js";

const router = express.Router();

router.post("/add", protectRoute, addMessage);
router.post("/update", protectRoute, updateMessage);
router.get('/latestMessages',protectRoute,getMessages);
router.post("/delete/:msgId", protectRoute, deleteMessage);

export default router;

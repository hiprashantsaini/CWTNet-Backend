import express from 'express';
import { createEvent, deleteEvent, getAllEvents, getEventDetail, joinEvent, updateEvent } from '../controllers/event.controller.js';
const router = express.Router();


import { protectRoute } from "../middleware/auth.middleware.js";

router.post('/create',protectRoute,createEvent);
router.get('/all', protectRoute, getAllEvents);
router.get('/detail/:eventId', protectRoute,getEventDetail);
router.post('/join/:eventId', protectRoute,joinEvent);
router.post('/update/:eventId',protectRoute,updateEvent);
router.delete('/delete/:eventId',protectRoute,deleteEvent);



export default router;
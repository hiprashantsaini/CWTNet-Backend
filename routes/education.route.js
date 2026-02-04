import express from 'express';
import { addEducation, deleteEducation, getUserEducation, updateEducation } from '../controllers/education.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const router = express.Router();

router.post('/add',protectRoute ,addEducation);
router.put('/update/:id',protectRoute, updateEducation);
router.get('/:userId', getUserEducation);
router.delete('/:id',protectRoute,deleteEducation);

export default router;
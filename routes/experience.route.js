import express from 'express';
import { createExperience, deleteExperience, getUserExperience, updateExperience } from '../controllers/experience.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const router = express.Router();

router.post('/add',protectRoute ,createExperience);
router.get('/:userId',getUserExperience);
router.post('/update/:id',protectRoute,updateExperience);
router.delete('/:id',protectRoute,deleteExperience);


export default router;
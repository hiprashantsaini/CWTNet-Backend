import express from 'express';
import { createInternship, deleteInternship, getAllInternships, getUserInternships, updateInternship } from '../controllers/internship.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllInternships);

router.get('/user/:userId', getUserInternships);

router.post('/', protectRoute, createInternship);
router.put('/:internshipId', protectRoute, updateInternship);
router.delete('/:internshipId', protectRoute, deleteInternship);

export default router;
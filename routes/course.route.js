import express from 'express';
import { createCourse, deleteCourse, getUserCourses, updateCourse } from '../controllers/course.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const router = express.Router();

router.post('/add',protectRoute ,createCourse);
router.get('/:userId',getUserCourses);
router.patch('/:id',protectRoute,updateCourse);
router.delete('/:id',protectRoute,deleteCourse);


export default router;
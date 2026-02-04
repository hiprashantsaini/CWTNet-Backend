import express from 'express';
import { addSkill, deleteSkill, getSkills, updateSkill } from '../controllers/skill.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const router = express.Router();

router.post('/add',protectRoute ,addSkill);
router.get('/:userId',getSkills);
router.put('/update/:skillId',protectRoute,updateSkill);
router.delete('/:skillId',protectRoute,deleteSkill);


export default router;
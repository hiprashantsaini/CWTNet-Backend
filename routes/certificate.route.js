import express from 'express';
import { createCertificate, deleteCertificate, getUserCertificates, updateCertificate } from '../controllers/certificate.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const router = express.Router();

router.post('/add',protectRoute ,createCertificate);
router.get('/:userId',getUserCertificates);
router.post('/update/:id',protectRoute,updateCertificate);
router.delete('/:id',protectRoute,deleteCertificate);


export default router;
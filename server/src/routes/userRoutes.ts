import express from 'express';
import { editUser, updateProfilePicture } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.put('/editUser', authenticateToken, editUser);
router.post('/profilePicture', authenticateToken, upload.single('file'), updateProfilePicture);

export default router;
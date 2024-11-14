import express from 'express';
import { getUsers, editUser, deleteUser } from '../controllers/adminController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/users', authenticateToken, getUsers);
router.put('/editUser/:userId', authenticateToken, editUser);
router.delete('/deleteUser/:userId', authenticateToken, deleteUser);

export default router;
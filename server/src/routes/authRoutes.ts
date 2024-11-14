import express from 'express';
import { login, register, getUser, refreshToken, logout } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', authenticateToken, getUser);
router.post('/refreshToken', refreshToken);
router.post('/logout', logout);

export default router;
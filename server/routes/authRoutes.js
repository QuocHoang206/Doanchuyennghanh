import express from 'express';
import { register, login, getUsers, updateUser, deleteUser } from '../controller/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', verifyToken, isAdmin, getUsers);
router.put('/update/:id', verifyToken, isAdmin, updateUser);
router.delete('/delete/:id', verifyToken, isAdmin, deleteUser);
export default router;
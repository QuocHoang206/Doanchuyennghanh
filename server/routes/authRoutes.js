import express from 'express';
import { register, login, getUsers, updateUser, deleteUser,getMyProfile,    updateMyProfile, updateUserRole,searchUsers } from '../controller/authController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import { isSuperAdmin } from '../middleware/superadminMiddleware.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/users', verifyToken, isAdmin, getUsers);
router.put('/update/:id', verifyToken, isAdmin, updateUser);
router.delete('/delete/:id', verifyToken, isAdmin, deleteUser);
router.get('/search', verifyToken, isAdmin, searchUsers);

router.put('/me', verifyToken, updateMyProfile);
router.get('/me', verifyToken, getMyProfile);


router.put('/role/:id', verifyToken, isSuperAdmin, updateUserRole);
export default router;
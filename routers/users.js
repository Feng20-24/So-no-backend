import express from 'express';
import {verifyToken} from '../middlewares/auth.js';
import {UserController} from '../controllers/UserController.js';

const router = express.Router();

router.post('/', UserController.createUserSignIn);
router.patch('/personal', verifyToken, UserController.updatePersonalInfo);
router.patch('/info', verifyToken, UserController.updatePersonalInfo);

export default router;
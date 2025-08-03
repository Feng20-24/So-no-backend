import express from 'express';
import {verifyToken} from '../middlewares/auth.js';
import {UserController} from "../controllers/UserController.js";

const router = express.Router();

router.post('/login', UserController.login);
router.post('/signup', UserController.signUpUser);
router.get('/me', verifyToken, UserController.getCurrentUser);
router.post('/verify', verifyToken, UserController.verifyToken);

export default router;
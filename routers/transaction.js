import express from 'express';
import {TransactionController} from '../controllers/TransactionController.js';

const router = express.Router();

router.get('/', TransactionController.getMyTransactions);
router.post('/', TransactionController.createTransaction);

export default router;
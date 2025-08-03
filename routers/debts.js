import express from 'express';
import {DebtListController} from '../controllers/DebtListController.js';

const router = express.Router();

router.get('/', DebtListController.getMyDebts);
router.post('/', DebtListController.createDebt);
router.patch('/:id', DebtListController.updateDebt);
router.patch('/:id/description', DebtListController.updateDescription);

export default router;
import express from 'express';
import {CustomerController} from '../controllers/CustomerController.js';

const router = express.Router();

router.get('/', CustomerController.getMyCustomers);
router.post('/', CustomerController.createCustomer);
router.patch('/:id', CustomerController.updateCustomer);

export default router;
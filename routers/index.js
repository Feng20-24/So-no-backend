import usersRouter from './users.js';
import customersRouter from './customers.js';
import debtsRouter from './debts.js';
import transactionsRouter from './transaction.js';
import authRouter from './auth.js';
import {verifyToken} from '../middlewares/auth.js';

function router(app) {
    app.use('/auth', authRouter);
    
    app.use('/users', verifyToken, usersRouter);
    app.use('/customers', verifyToken, customersRouter);
    app.use('/debts', verifyToken, debtsRouter);
    app.use('/transactions', verifyToken, transactionsRouter);
}

export default router;

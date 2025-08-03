import Transaction from '../models-orm-sequelize/Transaction.js';

export class TransactionController {
    static async getMyTransactions(req, res) {
        try {
            const userId = req.user.id; // Use authenticated user's ID
            const transactions = await Transaction.findByUserId(userId);
            res.json(transactions);
        } catch (err) {
            res.status(500).json({
                error: err.message,
                message: "Error getting transactions"
            });
        }
    }

    static async createTransaction(req, res) {
        try {
            const data = req.body;
            const userId = req.user.id; // Use authenticated user's ID
            
            const transactionData = {
                ...data,
                userId: userId // Secure - can't be manipulated
            };
            
            const result = await Transaction.createTransaction(transactionData);
            res.status(201).json(result);
        } catch (err) {
            res.status(500).json({
                error: err.message,
                message: "Error creating transaction"
            });
        }
    }
}
import Debt from "../models-orm-sequelize/Debt.js";
import Customer from "../models-orm-sequelize/Customer.js";

export class DebtListController {
    static async getMyDebts(req, res) {
        try {
            const userId = req.user.id;
            const debts = await Debt.getDebtsByUserId(userId);
            res.json(debts);
        } catch (err) {
            res.status(500).json({error: err.message});
        }
    }

    static async createDebt(req, res) {
        try {
            const data = req.body;
            const userId = req.user.id; // Use authenticated user's ID
            
            const customerId = await Customer.returnIdByname(data.personName);
            const debtObj = {
                customerId: customerId,
                userId: userId, // Secure - can't be manipulated
                status: data.status || 'unpaid',
                name: data.name,
                description: data.notes || data.description || '',
                originalAmount: data.originalAmount || data.amount || 0,
                amount: data.amount,
                date: data.date,
                recurringDay: (data.isRecurring === true || data.isRecurring === "true" ? data.recurringDay : 0),
            };
            const debt = await Debt.createDebt(debtObj);
            res.status(201).json(debt);
        } catch (err) {
            res.status(500).json({error: err.message});
        }
    }

    static async updateDebt(req, res) {
        try {
            const debtId = req.params.id;
            const userId = req.user.id; // Use authenticated user's ID
            
            // Verify ownership
            const debt = await Debt.findByPk(debtId);
            if (!debt || debt.userId !== userId) {
                return res.status(403).json({ message: 'Access denied' });
            }
            
            const data = {...req.body, id: debtId};
            const changes = await Debt.updateDebt(data);
            if (!changes) return res.status(404).json({
                message: "Debt not found"
            });
            res.json(changes);
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }

    static async updateDescription(req, res) {
        try {
            const debtId = req.params.id;
            const userId = req.user.id; // Use authenticated user's ID
            
            // Verify ownership
            const debt = await Debt.findByPk(debtId);
            if (!debt || debt.userId !== userId) {
                return res.status(403).json({ message: 'Access denied' });
            }
            
            const {description} = req.body;
            const updatedDebt = await Debt.updateDebtDescription(debtId, description);
            res.status(200).json(updatedDebt);
        } catch (err) {
            res.status(500).json({
                error: err.message
            });
        }
    }
}
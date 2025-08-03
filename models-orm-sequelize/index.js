import User from './User.js';
import Customer from './Customer.js';
import Debt from './Debt.js';
import Transaction from './Transaction.js';

User.hasMany(Customer, { foreignKey: 'userId', as: 'customers' });
Customer.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Debt, { foreignKey: 'userId', as: 'debts' });
Debt.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Customer.hasMany(Debt, { foreignKey: 'customerId', as: 'debts' });
Debt.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

Customer.hasMany(Transaction, { foreignKey: 'customerId', as: 'transactions' });
Transaction.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

Debt.hasMany(Transaction, { foreignKey: 'debtId', as: 'transactions' });
Transaction.belongsTo(Debt, { foreignKey: 'debtId', as: 'debt' });

User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export {
    User,
    Customer,
    Debt,
    Transaction
};
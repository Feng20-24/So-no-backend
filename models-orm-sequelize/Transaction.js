import { DataTypes } from 'sequelize';
import sequelize from '../database2/database-orm.js';
import Customer from './Customer.js';
import Debt from './Debt.js';

const Transaction = sequelize.define(
    'Transaction',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        customerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'customer_id',
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'user_id',
        },
        debtId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'debt_id',
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'success',
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        }
    },
    {
        tableName: 'transactions',
        timestamps: false,
    },
);

Transaction.findByUserId = async (id) => {
    const transactions = await Transaction.findAll({
        where: { userId: id },
        include: [
            {
                model: Customer,
                as: 'customer',
                attributes: ['name']
            },
            {
                model: Debt,
                as: 'debt',
                attributes: ['description']
            }
        ],
        raw: false
    });
    
    return transactions.map(transaction => {
        const transactionData = transaction.toJSON();
        if (transaction.customer) {
            transactionData.customerName = transaction.customer.name;
        }
        if (transaction.debt) {
            transactionData.debtDescription = transaction.debt.description;
        }
        return transactionData;
    });
};

Transaction.findByDebt = async (debtId) => {
    return await Transaction.findAll({
        where: { debtId }
    });
};

Transaction.createTransaction = async (transaction) => {
    return await Transaction.create({
        ...transaction,
        date: new Date().toISOString()
    });
};

export default Transaction; 
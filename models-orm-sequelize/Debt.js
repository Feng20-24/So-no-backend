import { DataTypes, Op } from 'sequelize';
import sequelize from '../database2/database-orm.js';
import Customer from './Customer.js';

const Debt = sequelize.define(
    'Debt',
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
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'unpaid',
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: '',
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        originalAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        recurringDay: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        lastUpdate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'last_update',
        },
    },
    {
        tableName: 'debts',
        timestamps: false,
    },
);

Debt.createDebt = async (debt) => {
    return await Debt.create({
        ...debt,
        lastUpdate: new Date().toISOString()
    });
};

Debt.getDebtsByUserId = async (userId) => {
    const debts = await Debt.findAll({
        where: { userId },
        include: [{
            model: Customer,
            as: 'customer',
            attributes: ['name']
        }],
        raw: false
    });
    
    return debts.map(debt => {
        const debtData = debt.toJSON();
        if (debt.customer) {
            debtData.customerName = debt.customer.name;
        }
        return debtData;
    });
};

Debt.updateDebt = async (data) => {
    const updateData = { amount: data.amount };
    
    if (data.amount === 0 || data.amount == 0) {
        updateData.status = 'paid';
    }
    
    await Debt.update(updateData, { where: { id: data.id } });
    return await Debt.findByPk(data.id);
};

Debt.updateDebtDescription = async (id, description) => {
    await Debt.update(
        { description },
        { where: { id } }
    );
    return await Debt.findByPk(id);
};

Debt.updateAllDebtStatus = async (currentDate = new Date()) => {
    const debts = await Debt.findAll({
        where: {
            status: { [Op.in]: ['pending', 'unpaid'] }
        }
    });
    
    for (const debt of debts) {
        if (debt.date < currentDate) {
            await Debt.update(
                { status: 'overdue' },
                { where: { id: debt.id } }
            );
        }
    }

    const allRecurringDebts = await Debt.findAll({
        where:{
            [Op.not] : {recurringDay: 0}
        }
    })

    for (const debt of allRecurringDebts) {
        if ( debt.date === currentDate) {
            await Debt.update(
                {
                    amount: debt.amount + debt.originalAmount ,
                    status: 'unpaid'
                },
                { where: { id: debt.id } }
            )
        }
    }
};

export default Debt; 
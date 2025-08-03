import { DataTypes } from 'sequelize';
import sequelize from '../database2/database-orm.js';

const Customer = sequelize.define(
    'Customer',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'user_id',
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false, 
        },
        citizenId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'citizen_id',
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'phone_number',
        },
        lastUpdate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'last_update',
        }
    },
    {
        tableName: 'customers',
        timestamps: false,
    },
);

Customer.returnIdByname = async (name) => {
    const customer = await Customer.findOne({ where: { name } });
    return customer ? customer.id : null;
};

Customer.findByUserId = async (userId) => {
    const customers = await Customer.findAll({ where: { userId } });
    return customers;
};

Customer.createCustomer = async (customer) => {
    return await Customer.create({
        ...customer,
        lastUpdate: new Date().toISOString()
    });
};

Customer.updateInfo = async (customer) => {
    await Customer.update(customer, { where: { id: customer.id } });
    return await Customer.findByPk(customer.id);
};

export default Customer;
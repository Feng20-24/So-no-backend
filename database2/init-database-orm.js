import sequelize from './database-orm.js';
import { connectDb } from './database-orm.js';
import '../models-orm-sequelize/index.js'; // Import all models to register them with Sequelize
import { User, Customer, Debt, Transaction } from '../models-orm-sequelize/index.js';
import crypto from 'crypto';

async function initDatabase() {
    try {
        await connectDb();
        
        // Check if data already exists
        const existingUsers = await User.count();
        if (existingUsers > 0) {
            console.log('Database already has data. Skipping initialization.');
            return;
        }
        
        // Only create tables if they don't exist (don't force recreate)
        await sequelize.sync();
        console.log('Database & tables created!');
        
        const salt1 = crypto.randomBytes(16).toString('hex');
        const salt2 = crypto.randomBytes(16).toString('hex');
        
        const hashedPassword1 = crypto.pbkdf2Sync('password123', salt1, 310000, 32, 'sha256').toString('hex');
        const hashedPassword2 = crypto.pbkdf2Sync('password456', salt2, 310000, 32, 'sha256').toString('hex');

        const user1 = await User.create({
            name: 'Alice',
            email: 'alice@example.com',
            phoneNumber: '1234567890',
            createdAt: '2024-06-01T10:00:00Z',
            salt: salt1,
            hashedPassword: hashedPassword1
        });

        const user2 = await User.create({
            name: 'Bob',
            email: 'bob@example.com',
            phoneNumber: '0987654321',
            createdAt: '2024-06-02T11:00:00Z',
            salt: salt2,
            hashedPassword: hashedPassword2
        });

        // Create sample customers
        const customer1 = await Customer.create({
            userId: user1.id,
            name: 'Charlie',
            citizenId: '111111111',
            email: 'charlie@example.com',
            address: '123 Main St',
            phoneNumber: '5551112222',
            lastUpdate: '2024-06-03T12:00:00Z'
        });

        const customer2 = await Customer.create({
            userId: user1.id,
            name: 'Diana',
            citizenId: '222222222',
            email: 'diana@example.com',
            address: '456 Elm St',
            phoneNumber: '5553334444',
            lastUpdate: '2024-06-04T13:00:00Z'
        });

        const customer3 = await Customer.create({
            userId: user2.id,
            name: 'Eve',
            citizenId: '333333333',
            email: 'eve@example.com',
            address: '789 Oak St',
            phoneNumber: '5555556666',
            lastUpdate: '2024-06-05T14:00:00Z'
        });

        const debt1 = await Debt.create({
            customerId: customer1.id,
            userId: user1.id,
            status: 'unpaid',
            name: 'Loan for car',
            description: 'Car loan payment',
            originalAmount: 3000,
            amount: 3000,
            date: '2024-06-06',
            recurringDay: 0,
            lastUpdate: '2024-06-06T15:00:00Z'
        });

        const debt2 = await Debt.create({
            customerId: customer2.id,
            userId: user1.id,
            status: 'unpaid',
            name: 'Loan for house',
            description: 'House renovation loan',
            originalAmount: 2000,
            amount: 2000,
            date: '2024-06-07',
            recurringDay: 2,
            lastUpdate: '2024-06-07T16:00:00Z'
        });

        const debt3 = await Debt.create({
            customerId: customer3.id,
            userId: user2.id,
            status: 'unpaid',
            name: 'Loan for business',
            description: 'Business startup loan',
            originalAmount: 2000,
            amount: 2000,
            date: '2024-06-08',
            recurringDay: 0,
            lastUpdate: '2024-06-08T17:00:00Z'
        });

        const debt4 = await Debt.create({
            customerId: customer1.id,
            userId: user1.id,
            status: 'unpaid',
            name: 'Recurring gym fee',
            description: 'Monthly gym membership',
            originalAmount: 500,
            amount: 500,
            date: '2024-06-09',
            recurringDay: 2,
            lastUpdate: '2024-06-09T18:00:00Z'
        });

        const debt5 = await Debt.create({
            customerId: customer2.id,
            userId: user1.id,
            status: 'unpaid',
            name: 'One-time groceries',
            description: 'Grocery shopping',
            originalAmount: 400,
            amount: 400,
            date: '2024-06-10',
            recurringDay: 0,
            lastUpdate: '2024-06-10T19:00:00Z'
        });

        // Create sample transactions
        const transaction1 = await Transaction.create({
            customerId: customer1.id,
            userId: user1.id,
            debtId: debt1.id,
            description: 'Partial payment for car loan',
            status: 'success',
            amount: 1000,
            date: '2024-06-11T10:00:00Z'
        });

        const transaction2 = await Transaction.create({
            customerId: customer2.id,
            userId: user1.id,
            debtId: debt2.id,
            description: 'Payment for house loan',
            status: 'success',
            amount: 500,
            date: '2024-06-12T11:00:00Z'
        });

        const transaction3 = await Transaction.create({
            customerId: customer1.id,
            userId: user1.id,
            debtId: debt4.id,
            description: 'Gym fee payment',
            status: 'success',
            amount: 500,
            date: '2024-06-13T12:00:00Z'
        });

        const transaction4 = await Transaction.create({
            customerId: customer3.id,
            userId: user2.id,
            debtId: debt3.id,
            description: 'Business loan payment',
            status: 'success',
            amount: 1000,
            date: '2024-06-14T13:00:00Z'
        });

        console.log('Sample data inserted successfully!');
        console.log(`Created ${user1.id} users, ${customer1.id} customers, ${debt1.id} debts, ${transaction1.id} transactions`);
        
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

initDatabase();



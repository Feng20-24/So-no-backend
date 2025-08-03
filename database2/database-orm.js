import {Sequelize} from 'sequelize';
import path from 'path';
import {fileURLToPath} from 'url';
import sqlite3 from 'sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'database.db');

console.log('Using database file:', DB_PATH);

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: DB_PATH,
    logging: false, // Disable SQL logging to avoid deprecation warning
})

export async function connectDb() {
    try{
        // First, ensure the database file exists by creating a connection
        const db = new sqlite3.Database(DB_PATH, (err) => {
            if (err) {
                console.error('Failed to create database file:', err.message);
            } else {
                console.log('Database file created/connected successfully.');
            }
        });
        
        // Close the initial connection
        db.close();
        
        // Now authenticate with Sequelize
        await sequelize.authenticate();
        console.log('Database Connected');
        
        // Only sync if tables don't exist (don't alter existing tables)
        await sequelize.sync();
        console.log('Database tables synchronized');
        
    } catch (error) {
        console.error('Cannot connect to the database', error);
    }
}

export default sequelize;
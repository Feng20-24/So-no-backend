import jwt from 'jsonwebtoken';
import { User } from "../models-orm-sequelize/index.js";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

export const authenticateUser = async (identifier, password) => {
    return await User.authenticateUser(identifier, password);
};

export const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id, 
            email: user.email,
            name: user.name 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
};

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;
    
    if (!token) {
        return res.status(401).json({
            message: 'Access token required'
        });
    }

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export const hashPassword = (password) => {
    return User.hashPassword(password);
};
import { DataTypes, Op } from 'sequelize';
import sequelize from '../database2/database-orm.js';
import crypto from 'crypto';

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'phone_number',
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        salt: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        hashedPassword: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'hashed_password',
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: 'created_at',
        }
    },
    {
        tableName: 'users',
        timestamps: false,
    },
);

User.createUser = async (user) => {
    return await User.create({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        password: user.password,
        createdAt: new Date().toISOString()
    });
};

User.updatePersonalInfo = async (id, { name, email, phoneNumber, avatarLink }) => {
   return  await User.update(
        { name, email, phoneNumber },
        { where: { id } }
    );
};

User.findByEmail = async (email) => {
    const user = await User.findOne({ where: { email } });
    return user;
};

User.createUserWithHash = async (userData) => {
    const user = await User.create({
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        password: userData.password,
        salt: userData.salt,
        hashedPassword: userData.hashedPassword,
        name: userData.name,
        createdAt: new Date().toISOString()
    });
    return user.id;
};

User.getCurrentUser = async (id) => {
    const user = await User.findByPk(id, {
        attributes: ['id', 'name', 'email', 'phoneNumber']
    });
    
    if (!user) return null;
    
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber
    };
};

User.authenticateUser = async (identifier, password) => {
    try {
        // Try to find user by email first, then by phone
        let user = await User.findOne({ where: { email: identifier } });
        
        if (!user) {
            user = await User.findOne({ where: { phoneNumber: identifier } });
        }

        if (!user) {
            throw new Error("Incorrect email or password");
        }

        // Check if user has salt and hashedPassword (new format)
        if (user.salt && user.hashedPassword) {
            return new Promise((resolve, reject) => {
                crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
                    if (err) { 
                        reject(new Error('Password verification failed')); 
                        return;
                    }
                    if (!crypto.timingSafeEqual(Buffer.from(user.hashedPassword, 'hex'), hashedPassword)) {
                        reject(new Error('Incorrect email or password'));
                        return;
                    }
                    resolve(user);
                });
            });
        } 
        // Check if user has plain password (old format)
        else if (user.password) {
            if (user.password !== password) {
                throw new Error('Incorrect email or password');
            }
            return user;
        }
        // No password found
        else {
            throw new Error('Invalid user account');
        }
    } catch (error) {
        throw error;
    }
};

User.hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err, hashedPassword) => {
            if (err) reject(err);
            resolve({
                salt,
                hashedPassword: hashedPassword.toString('hex')
            });
        });
    });
};

export default User;
import User from "../models-orm-sequelize/User.js";
import {generateToken, authenticateUser} from "../middlewares/auth.js";
import {AvatarService} from "../service/image.js";

export class UserController {
    static async getCurrentUser(req, res) {
        try {
            // req.user comes from JWT verification middleware
            const user = await User.getCurrentUser(req.user.id);
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user);
        } catch (error) {
            console.error('Get current user error:', error);
            res.status(500).json({ message: 'Database error' });
        }
    }

    static async login(req, res) {
        try {
            const { identifier, password } = req.body;

            if (!identifier || !password) {
                return res.status(400).json({ message: 'Email/phone and password are required' });
            }

            const user = await authenticateUser(identifier, password);
            const token = generateToken(user);
            
            res.json({
                message: 'Login successful',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    avatarLink: user.avatarLink
                },
                token
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(401).json({ message: error.message || 'Invalid credentials' });
        }
    }

        static async updatePersonalInfo(req, res) {
        try {
            const userId = req.user.id;
            const { name, email, phoneNumber, avatar } = req.body;
            const avatarLink = await AvatarService(avatar);
            await User.updatePersonalInfo(userId, { name, email, phoneNumber, avatarLink });
            const updatedUser = await User.findByPk(userId);
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({
                error: error.message,
                message: "Error updating personal info"
            });
        }
    }



    static async signUpUser(req, res) {
        try {
            const {identifier, password} = req.body;

            if (!identifier.includes('@')) {
                return res.status(400).json({message: 'Email is required for signup'});
            }

            const existingUser = await User.findByEmail(identifier);
            if (existingUser) {
                return res.status(409).json({message: 'User already exists'});
            }

            const {salt, hashedPassword} = await User.hashPassword(password);

            const userId = await User.createUserWithHash({
                email: identifier,
                phoneNumber: '',
                password: hashedPassword,
                salt,
                hashedPassword,
                name: 'User'
            });

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(500).json({message: 'Failed to retrieve created user'});
            }

            const token = generateToken(user);

            res.status(201).json({
                message: 'User created successfully',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    avatarLink: user.avatarLink
                },
                token
            });

        } catch (error) {
            console.error('Signup error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async verifyToken(req, res) {
        res.json({ valid: true, user: req.user });
    }
}
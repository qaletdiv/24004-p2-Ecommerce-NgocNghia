const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Account, User } = require('../models');
const config = require('../config/config');
const { validateRegistration, validateLogin } = require('../validators/userValidator');

const router = express.Router();

// Register
router.post('/register', validateRegistration, async (req, res, next) => {
    try {
        const { user_email, password, user_full_name, phone_number, gender, DOB, home_address, office_address } = req.body;

        // Check if user already exists
        const existingAccount = await Account.findOne({ where: { user_email } });
        if (existingAccount) {
            return res.status(409).json({
                success: false,
                error: { message: 'User already exists with this email' }
            });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create account and user in a transaction
        const result = await sequelize.transaction(async (t) => {
            const account = await Account.create({
                user_email,
                password: hashedPassword
            }, { transaction: t });

            const user = await User.create({
                account_id: account.account_id,
                user_full_name: user_full_name || null,
                phone_number: phone_number || null,
                gender: gender || null,
                DOB: DOB ? new Date(DOB) : null,
                home_address: home_address || null,
                office_address: office_address || null
            }, { transaction: t });

            return { account, user };
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: result.user.user_id, email: user_email },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                token,
                user: {
                    user_id: result.user.user_id,
                    email: user_email,
                    full_name: result.user.user_full_name,
                    phone_number: result.user.phone_number
                }
            }
        });

    } catch (error) {
        next(error);
    }
});

// Login
router.post('/login', validateLogin, async (req, res, next) => {
    try {
        const { user_email, password } = req.body;

        // Find account with user details
        const account = await Account.findOne({
            where: { user_email },
            include: [{
                model: User,
                as: 'user'
            }]
        });

        if (!account) {
            return res.status(401).json({
                success: false,
                error: { message: 'Invalid email or password' }
            });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, account.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: { message: 'Invalid email or password' }
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: account.user.user_id, email: user_email },
            config.JWT_SECRET,
            { expiresIn: config.JWT_EXPIRES_IN }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    user_id: account.user.user_id,
                    email: user_email,
                    full_name: account.user.user_full_name,
                    profile_image: account.user.profile_user_image,
                    phone_number: account.user.phone_number,
                    gender: account.user.gender,
                    DOB: account.user.DOB,
                    home_address: account.user.home_address,
                    office_address: account.user.office_address
                }
            }
        });

    } catch (error) {
        next(error);
    }
});

// Logout (client-side token deletion, but we can also add token blacklisting)
router.post('/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Logout successful'
    });
});

module.exports = router;
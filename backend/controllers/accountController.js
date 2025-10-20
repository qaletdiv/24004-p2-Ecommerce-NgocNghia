const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Account, Sequelize} = require('../models');

// Register a new account
exports.register = async (req, res, next) => {
    try {
        const { account_name ,user_email, password } = req.body;
        
        const saltRound = 10;

        /// Hash password
        const hashedPassword = await bcrypt.hash(password, saltRound);

        const newAccount = await Account.create({
            account_name,
            user_email,
            password: hashedPassword
        });

        const userResponse = await Account.findByPk(newAccount.account_id);

        res.status(201).json({ message: 'Account created successfully', account: userResponse });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            const field = error.errors[0].path;
            return res.status(409).json({
                message: `Error in register`, 
                errors: [{
                    msg: `${field} already exists`,
                    param: field,
                }]
            })
        }
        if (error.name === 'SequelizeValidationError') {
            const message = error.errors.map(err => ({msg: err.message, param: err.path}))
            return res.status(400).json({
                message: `Error in register`,
                errors: message
            })
        }
        next(error);
    }
}

exports.login = async (req, res, next) => {
    try {
        const { user_email, password } = req.body;
        const account = await Account.scope('withPassword').findOne({ 
            where: { 
                [Sequelize.Op.or] : [
                    {user_email: user_email },
                ]
            } 
        });

        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }

        /// Compare password
        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        /// Generate JWT token
        const payload = {
            accountId: account.account_id,
        }

        const secretKey = process.env.JWT_SECRET;
        const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

        /// Create token
        const token = jwt.sign(payload,secretKey, {expiresIn});

        res.json ({
            message: 'Login successful',
            token,
            account: {
                id: account.account_id,
                account_name: account.account_name,
                user_email: account.user_email,
                
            }
        });
    } catch(error) {
        next(error);
    }
}
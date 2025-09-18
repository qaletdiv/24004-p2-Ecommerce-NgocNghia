const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User, Account } = require('../models');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                error: { message: 'No token provided' }
            });
        }
        
        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await User.findByPk(decoded.userId, {
            include: [{
                model: Account,
                as: 'account',
                attributes: ['user_email']
            }]
        });
        
        if (!user) {
            return res.status(401).json({
                success: false,
                error: { message: 'User not found' }
            });
        }
        
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    authMiddleware
};
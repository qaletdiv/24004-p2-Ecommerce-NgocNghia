const express = require('express');
const { User, Account } = require('../models');
const { authMiddleware } = require('../middlewares/auth');
const { validateProfileUpdate } = require('../validators/userValidator');

const router = express.Router();

// GET all users with their profile
router.get('/', async (req, res, next) => {
    try {
        const users = await User.findAll({
            include: [{
                model: Profile,
                as: 'profile'
            }]
        });
        res.json(users);
    } catch (error) {
        next(error);
    }
});
// Get user profile
router.get('/profile', authMiddleware, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.user_id, {
            include: [{
                model: Account,
                as: 'account',
                attributes: ['user_email']
            }]
        });

        res.json({
            success: true,
            data: {
                user_id: user.user_id,
                email: user.account.user_email,
                full_name: user.user_full_name,
                profile_image: user.profile_user_image,
                phone_number: user.phone_number,
                gender: user.gender,
                DOB: user.DOB,
                home_address: user.home_address,
                office_address: user.office_address
            }
        });
    } catch (error) {
        next(error);
    }
});

// Update user profile
router.put('/profile', authMiddleware, validateProfileUpdate, async (req, res, next) => {
    try {
        const { user_full_name, phone_number, gender, DOB, home_address, office_address, profile_user_image } = req.body;

        await User.update({
            user_full_name,
            phone_number,
            gender,
            DOB: DOB ? new Date(DOB) : null,
            home_address,
            office_address,
            profile_user_image
        }, {
            where: { user_id: req.user.user_id }
        });

        const updatedUser = await User.findByPk(req.user.user_id, {
            include: [{
                model: Account,
                as: 'account',
                attributes: ['user_email']
            }]
        });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user_id: updatedUser.user_id,
                email: updatedUser.account.user_email,
                full_name: updatedUser.user_full_name,
                profile_image: updatedUser.profile_user_image,
                phone_number: updatedUser.phone_number,
                gender: updatedUser.gender,
                DOB: updatedUser.DOB,
                home_address: updatedUser.home_address,
                office_address: updatedUser.office_address
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
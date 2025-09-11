const express = require('express');
const { Payment, User } = require('../models');
const { authMiddleware } = require('../middlewares/auth');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../validators/userValidator');

const router = express.Router();

// Validation for payment methods
const validatePaymentMethod = [
    body('card_name')
        .notEmpty()
        .withMessage('Card name is required')
        .isLength({ min: 2, max: 255 })
        .withMessage('Card name must be between 2 and 255 characters'),
    body('card_number')
        .notEmpty()
        .withMessage('Card number is required')
        .matches(/^[0-9]{13,19}$/)
        .withMessage('Card number must be 13-19 digits'),
    body('card_code')
        .notEmpty()
        .withMessage('Card code is required')
        .matches(/^[0-9]{3,4}$/)
        .withMessage('Card code must be 3-4 digits'),
    handleValidationErrors
];

// Add payment method
router.post('/methods', authMiddleware, validatePaymentMethod, async (req, res, next) => {
    try {
        const { card_name, card_number, card_code } = req.body;
        const userId = req.user.user_id;

        // In a real application, you would encrypt card details
        // For demo purposes, we'll just mask the card number
        const maskedCardNumber = card_number.slice(0, 4) + '****' + card_number.slice(-4);

        const payment = await Payment.create({
            user_id: userId,
            card_name,
            card_number: maskedCardNumber,
            card_code: '***', // Never store actual card code
            card_password: null // Not typically stored
        });

        res.status(201).json({
            success: true,
            message: 'Payment method added successfully',
            data: {
                card_id: payment.card_id,
                card_name: payment.card_name,
                card_number: payment.card_number
            }
        });

    } catch (error) {
        next(error);
    }
});

// Get user's payment methods
router.get('/methods', authMiddleware, async (req, res, next) => {
    try {
        const paymentMethods = await Payment.findAll({
            where: { user_id: req.user.user_id },
            attributes: ['card_id', 'card_name', 'card_number'],
            order: [['card_id', 'DESC']]
        });

        res.json({
            success: true,
            data: paymentMethods
        });

    } catch (error) {
        next(error);
    }
});

// Delete payment method
router.delete('/methods/:id', authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedRows = await Payment.destroy({
            where: { 
                card_id: id,
                user_id: req.user.user_id 
            }
        });

        if (deletedRows === 0) {
            return res.status(404).json({
                success: false,
                error: { message: 'Payment method not found' }
            });
        }

        res.json({
            success: true,
            message: 'Payment method deleted successfully'
        });

    } catch (error) {
        next(error);
    }
});

// Process payment (simplified version)
router.post('/process', authMiddleware, async (req, res, next) => {
    try {
        const { order_id, card_id, amount } = req.body;

        // Verify payment method belongs to user
        const paymentMethod = await Payment.findOne({
            where: { 
                card_id,
                user_id: req.user.user_id 
            }
        });

        if (!paymentMethod) {
            return res.status(404).json({
                success: false,
                error: { message: 'Payment method not found' }
            });
        }

        // In a real application, you would integrate with a payment processor
        // For demo purposes, we'll simulate a successful payment
        const success = Math.random() > 0.1; // 90% success rate for demo

        if (success) {
            // Create transaction record
            const { Transaction } = require('../models');
            await Transaction.create({
                user_id: req.user.user_id,
                transaction_amount: amount,
                transaction_date: new Date()
            });

            res.json({
                success: true,
                message: 'Payment processed successfully',
                data: {
                    transaction_id: Date.now(), // Demo transaction ID
                    status: 'completed',
                    amount
                }
            });
        } else {
            res.status(400).json({
                success: false,
                error: { message: 'Payment failed. Please try again.' }
            });
        }

    } catch (error) {
        next(error);
    }
});

module.exports = router;
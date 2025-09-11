const { body, validationResult } = require('express-validator');

// Validation middleware to check for errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: {
                message: 'Validation failed',
                details: errors.array()
            }
        });
    }
    next();
};

// Registration validation
const validateRegistration = [
    body('user_email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('user_full_name')
        .optional()
        .isLength({ min: 2, max: 255 })
        .withMessage('Full name must be between 2 and 255 characters')
        .trim(),
    body('phone_number')
        .optional()
        .matches(/^[0-9+\-\s()]+$/)
        .withMessage('Please provide a valid phone number'),
    handleValidationErrors
];

// Login validation
const validateLogin = [
    body('user_email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

// Profile update validation
const validateProfileUpdate = [
    body('user_full_name')
        .optional()
        .isLength({ min: 2, max: 255 })
        .withMessage('Full name must be between 2 and 255 characters')
        .trim(),
    body('phone_number')
        .optional()
        .matches(/^[0-9+\-\s()]+$/)
        .withMessage('Please provide a valid phone number'),
    body('gender')
        .optional()
        .isIn(['Male', 'Female', 'Other'])
        .withMessage('Gender must be Male, Female, or Other'),
    body('DOB')
        .optional()
        .isISO8601()
        .withMessage('Please provide a valid date of birth'),
    body('home_address')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Home address must be less than 500 characters'),
    body('office_address')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Office address must be less than 500 characters'),
    handleValidationErrors
];

// Product validation
const validateProduct = [
    body('product_name')
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ max: 255 })
        .withMessage('Product name must be less than 255 characters')
        .trim(),
    body('product_price')
        .isFloat({ min: 0 })
        .withMessage('Product price must be a positive number'),
    body('product_description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Product description must be less than 1000 characters')
        .trim(),
    body('category_id')
        .isInt({ min: 1 })
        .withMessage('Category ID must be a positive integer'),
    handleValidationErrors
];

// Order validation
const validateOrder = [
    body('items')
        .isArray({ min: 1 })
        .withMessage('Order must contain at least one item'),
    body('items.*.product_id')
        .isInt({ min: 1 })
        .withMessage('Product ID must be a positive integer'),
    body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer'),
    handleValidationErrors
];

module.exports = {
    validateRegistration,
    validateLogin,
    validateProfileUpdate,
    validateProduct,
    validateOrder,
    handleValidationErrors
};
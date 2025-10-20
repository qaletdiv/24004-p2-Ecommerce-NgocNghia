const {body} = require('express-validator');

const registerValidationRules = () => {
    return [
        body('account_name')
            .notEmpty().withMessage('Username không được để trống')
            .isLength({ min: 3, max: 50 }).withMessage('Username phải từ 3 đến 50 ký tự')
            .trim(),
        body('user_email')
            .notEmpty().withMessage('Email không được để trống')
            .isEmail().withMessage('Email không hợp lệ')
            .normalizeEmail(),
        body('password')
            .notEmpty().withMessage('Password không được để trống')
            .isLength({ min: 6 }).withMessage('Password phải có ít nhất 6 ký tự')
    ];
}

const loginValidationRules = () => {
    return [
        body('user_email')
            .notEmpty().withMessage('Email hoặc Username không được để trống')
            .trim(),
        body('password')
            .notEmpty().withMessage('Password không được để trống')
    ];
}
module.exports = {
    registerValidationRules,
    loginValidationRules
};
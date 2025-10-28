const {body, param} = require('express-validator');

const commonIdParamValidation = () => [
    param('id').isInt({min: 1}).withMessage('ID phải là một số nguyên dương')
];


const createCategoryValidationRules = () => {
    return [
        body('category_name')
            .notEmpty().withMessage('Tên danh mục không được để trống')
            .isLength({max: 100}).withMessage('Tên danh mục không được vượt quá 100 ký tự')
            .trim()
    ]
}

const updateCategoryValidationRules = () => {
    return [
        body('category_name')
            .optional()
            .notEmpty().withMessage('Tên danh mục không được để trống')
            .isLength({max: 100}).withMessage('Tên danh mục không được vượt quá 100 ký tự')
            .trim()
    ]
}

module.exports = {
    commonIdParamValidation,
    createCategoryValidationRules,
    updateCategoryValidationRules
};
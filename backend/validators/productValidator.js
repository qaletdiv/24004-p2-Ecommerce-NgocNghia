const {body, param} = require('express-validator');
const {Category} = require('../models');

const commonIdParamValidation = () => [
    param('id').isInt({min: 1}).withMessage('ID phải là một số nguyên dương')
];

const categoryExistValidation = body('category_id')
    .optional({nullable: true})
    .isInt({min: 1}).withMessage('Category ID phải là một số nguyên dương')
    .custom(async(value) => {
        if (value) {
            const category = await Category.findByPk(value);
            if (!category) {
                throw new Error('Danh mục không tồn tại');
            }
        }
        return true;
    });

const createProductValidationRules = () => {
    return [
        body('product_name')
            .notEmpty().withMessage('Tên sản phẩm không được để trống')
            .isLength({max: 100}).withMessage('Tên sản phẩm không được vượt quá 100 ký tự')
            .trim(),
        body('price')
            .notEmpty().withMessage('Giá sản phẩm không được để trống')
            .isFloat({min: 0}).withMessage('Giá sản phẩm phải là một số dương'),
        categoryExistValidation
    ]
}

const updateProductValidationRules = () => {
    return [
        body('product_name')
            .optional()
            .notEmpty().withMessage('Tên sản phẩm không được để trống')
            .isLength({max: 100}).withMessage('Tên sản phẩm không được vượt quá 100 ký tự')
            .trim(),
        body('price')
            .optional()
            .notEmpty().withMessage('Giá sản phẩm không được để trống')
            .isFloat({min: 0}).withMessage('Giá sản phẩm phải là một số dương'),
        categoryExistValidation
    ]
}

module.exports = {
    commonIdParamValidation,
    createProductValidationRules,
    updateProductValidationRules
};
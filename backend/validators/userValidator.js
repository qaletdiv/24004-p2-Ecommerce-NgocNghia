const {body, param} = require('express-validator');
const {Account} = require('../models');
const commonIdParamValidation = () => [
    param('id').isInt({min: 1}).withMessage('ID has to be a positive integer')
]

const userExistValidation = body('account_id')
    .optional({nullable: true})
    .isInt({min: 1}).withMessage('Account ID must be a positive integer')
    .custom(async(value) => {
        if (value) {
            const account = await Account.findByPk(value);
            if (!account) {
                return Promise.reject('Account ID does not exist');
            }
        }
    })

const createUserValidationRules = () => {
    return [
        body('user_full_name')
            .notEmpty().withMessage('Full name is required')
            .isLength({max: 255}).withMessage('Full name can be up to 255 characters long')
            .trim(),
        body('profile_user_image')
            .optional()
            .notEmpty().withMessage('Profile image is required')
            .isLength({max: 255}).withMessage('Profile image URL can be up to 255 characters long')
            .trim(),
        body('DOB')
            .optional({nullable: true})
            .isISO8601().withMessage('DOB must be a valid date'),
        body('gender')
            .optional({nullable: true})
            .isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),    
        body('phone_number')
            .optional({nullable: true})
            .isLength({max: 20}).withMessage('Phone number can be up to 20 characters long')
            .trim(),
        userExistValidation
    ]
}

const updateUserValidationRules = () => {
    return [
         body('user_full_name')
            .notEmpty().withMessage('Full name is required')
            .isLength({max: 255}).withMessage('Full name can be up to 255 characters long')
            .trim(),
        body('profile_user_image')
            .optional()
            .notEmpty().withMessage('Profile image is required')
            .isLength({max: 255}).withMessage('Profile image URL can be up to 255 characters long')
            .trim(),
        body('DOB')
            .optional({nullable: true})
            .isISO8601().withMessage('DOB must be a valid date'),
        body('gender')
            .optional({nullable: true})
            .isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),    
        body('phone_number')
            .optional({nullable: true})
            .isLength({max: 20}).withMessage('Phone number can be up to 20 characters long')
            .trim(),
        userExistValidation
    ]
}

module.exports = {
    commonIdParamValidation,
    createUserValidationRules,
    updateUserValidationRules
};
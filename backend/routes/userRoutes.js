const express = require('express');
const router = express.Router();
const { User, Account } = require('../models');
const handleValidationErrors = require('../middlewares/validationErrorHandler');
const {commonIdParamValidation,createUserValidationRules,updateUserValidationRules} = require('../validators/userValidator');
const { getUserById, updateUser,createUser, getProfile, updateUserAvatar} = require('../controllers/userController');

const authenticationToken = require('../middlewares/authenticationToken');
const {uploadSingleImage} = require('../middlewares/uploadMiddleware');
const {resizeImage} = require('../middlewares/imageProcessing');

router.get('/getProfile',
    authenticationToken,
    getProfile
);
// Create user
router.post('/',
    authenticationToken,
    createUserValidationRules(),
    handleValidationErrors,
    createUser
);

router.get('/:id', 
    authenticationToken,
    commonIdParamValidation(),
    handleValidationErrors,
    getUserById
);

router.put( '/:id',
    authenticationToken,
    commonIdParamValidation(),
    updateUserValidationRules(),
    handleValidationErrors,
    updateUser
)

router.patch('/update-my-avatar',
    authenticationToken,
    uploadSingleImage('avatar'),
    resizeImage,
    updateUserAvatar
)

module.exports = router;
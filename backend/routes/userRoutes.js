const express = require('express');
const router = express.Router();
const { User, Account } = require('../models');
const handleValidationErrors = require('../middlewares/validationErrorHandler');
const {commonIdParamValidation,createUserValidationRules,updateUserValidationRules} = require('../validators/userValidator');
const { getUserById, updateUser,createUser, getProfile, updateUserAvatar} = require('../controllers/userController');

const authenticationToken = require('../middlewares/authenticationToken');
const {uploadSingleImage} = require('../middlewares/uploadMiddleware');
const {resizeImage} = require('../middlewares/imageUserProcessing');

router.get('/getProfile',
    authenticationToken,
    getProfile
);

router.patch('/update-my-avatar',
    authenticationToken,
    uploadSingleImage('profile_user_image'),
    resizeImage,
    updateUserAvatar
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


module.exports = router;
const express = require('express');
const router = express.Router();

const {registerValidationRules, loginValidationRules} = require('../validators/authValidator');
const handleValidationErrors = require('../middlewares/validationErrorHandler');

const {register, login, logout} = require('../controllers/accountController');
const authenticationToken = require('../middlewares/authenticationToken');

// Register route
router.post('/register', 
    registerValidationRules(), 
    handleValidationErrors, 
    register);  

// Login route
router.post('/login', 
    loginValidationRules(), 
    handleValidationErrors, 
    login);

router.get('/logout',
    logout
);

module.exports = router;
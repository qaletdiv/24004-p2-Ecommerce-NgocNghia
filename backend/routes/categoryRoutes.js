const express = require('express');
const router = express.Router();

const {Category, Product} = require('../models');
const handleValidationErrors = require('../middlewares/validationErrorHandler');
const {commonIdParamValidation, createCategoryValidationRules, updateCategoryValidationRules} = require('../validators/categoryValidator');
const { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

const authenticationToken = require('../middlewares/authenticationToken');

// Get all categories
router.get('/',
    authenticationToken,
    getAllCategories
);

// Get category by ID
router.get('/:id', 
    authenticationToken,
    commonIdParamValidation(),
    handleValidationErrors,
    getCategoryById
);

// Create category
router.post('/',
    authenticationToken,
    createCategoryValidationRules(),
    handleValidationErrors,
    createCategory
);

// Update category
router.put('/:id',
    authenticationToken,
    commonIdParamValidation(),
    updateCategoryValidationRules(),
    handleValidationErrors,
    updateCategory
);

// Delete category
router.delete('/:id',
    authenticationToken,
    commonIdParamValidation(),
    handleValidationErrors,
    deleteCategory
);

module.exports = router;
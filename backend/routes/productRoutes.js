const express = require('express');
const router = express.Router();

const {Product, Category} = require('../models');
const handleValidationErrors = require('../middlewares/validationErrorHandler');
const {commonIdParamValidation, createProductValidationRules, updateProductValidationRules} = require('../validators/productValidator');
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

const authenticationToken = require('../middlewares/authenticationToken');

// Get all products
router.get('/',
    authenticationToken,
    getAllProducts
);

// Get product by ID
router.get('/:id', 
    authenticationToken,
    commonIdParamValidation(),
    handleValidationErrors,
    getProductById
);

// Create product
router.post('/',
    authenticationToken,
    createProductValidationRules(),
    handleValidationErrors,
    createProduct
);

// Update product
router.put('/:id',
    authenticationToken,
    commonIdParamValidation(),
    updateProductValidationRules(),
    handleValidationErrors,
    updateProduct
);

// Delete product
router.delete('/:id',
    authenticationToken,
    commonIdParamValidation(),
    handleValidationErrors,
    deleteProduct
);

module.exports = router;
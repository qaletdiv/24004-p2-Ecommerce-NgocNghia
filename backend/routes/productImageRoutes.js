const express = require('express');
const router = express.Router();

const {ProductImage, Product} = require('../models');
const authenticationToken = require('../middlewares/authenticationToken');
const {updateProductImage } = require('../controllers/productImage');
const {uploadSingleImage} = require('../middlewares/uploadMiddleware');
const {resizeImage} = require('../middlewares/imageProcessing');

/// Get all product include their image
router.get('/', async(req,res,next) => {
    try {
        const products = await Product.findAll({
            include: [{
                model: ProductImage,
                as: 'productImages'
            }]
        });
        res.json(products);
    } catch (error) {
        next(error);
    }
});

router.patch('/update-product-image/:id',
    authenticationToken,
    uploadSingleImage('image'),
    resizeImage,
    updateProductImage
)

module.exports = router;
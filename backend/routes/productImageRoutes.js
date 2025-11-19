const express = require('express');
const router = express.Router();

const {ProductImage, Product, Category} = require('../models');
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
                as: 'productImages',
                attributes: ['product_image_id', 'product_image_link']
            }, 
            {
                model: Category,
                as: 'category', 
                attributes: ['category_id', 'category_name']
            }],
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
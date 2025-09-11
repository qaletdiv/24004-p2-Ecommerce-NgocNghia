const express = require('express');
const { Product, Category, ProductImage } = require('../models');
const { validateProduct } = require('../validators/userValidator');
const { authMiddleware } = require('../middlewares/auth');

const router = express.Router();

// Get all products with pagination
router.get('/', async (req, res, next) => {
    try {
        const { page = 1, limit = 12, category, search } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        const includeClause = [
            {
                model: Category,
                as: 'category',
                attributes: ['category_name']
            },
            {
                model: ProductImage,
                as: 'images',
                attributes: ['product_image_link']
            }
        ];

        // Filter by category
        if (category) {
            includeClause[0].where = { category_name: { [Op.iLike]: `%${category}%` } };
        }

        // Search by product name or description
        if (search) {
            whereClause[Op.or] = [
                { product_name: { [Op.iLike]: `%${search}%` } },
                { product_description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const { count, rows: products } = await Product.findAndCountAll({
            where: whereClause,
            include: includeClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['product_id', 'DESC']]
        });

        // Transform data to match your frontend format
        const formattedProducts = products.map(product => ({
            id: product.product_id,
            name: product.product_name,
            price: new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(product.product_price),
            description: product.product_description,
            image: product.images.length > 0 ? product.images[0].product_image_link : '',
            category: product.category ? product.category.category_name : 'Uncategorized'
        }));

        res.json({
            success: true,
            data: {
                products: formattedProducts,
                pagination: {
                    current_page: parseInt(page),
                    total_pages: Math.ceil(count / limit),
                    total_products: count,
                    has_next: parseInt(page) < Math.ceil(count / limit),
                    has_prev: parseInt(page) > 1
                }
            }
        });
    } catch (error) {
        next(error);
    }
});

// Get single product
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id, {
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['category_name']
                },
                {
                    model: ProductImage,
                    as: 'images',
                    attributes: ['product_image_link']
                }
            ]
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                error: { message: 'Product not found' }
            });
        }

        const formattedProduct = {
            id: product.product_id,
            name: product.product_name,
            price: new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(product.product_price),
            description: product.product_description,
            image: product.images.length > 0 ? product.images[0].product_image_link : '',
            category: product.category ? product.category.category_name : 'Uncategorized',
            images: product.images.map(img => img.product_image_link)
        };

        res.json({
            success: true,
            data: formattedProduct
        });
    } catch (error) {
        next(error);
    }
});

// Create product (admin only - you may want to add admin middleware)
router.post('/', authMiddleware, validateProduct, async (req, res, next) => {
    try {
        const { product_name, product_price, product_description, category_id, images = [] } = req.body;

        const product = await Product.create({
            product_name,
            product_price,
            product_description,
            category_id
        });

        // Add images if provided
        if (images.length > 0) {
            const imageRecords = images.map(imageUrl => ({
                product_id: product.product_id,
                product_image_link: imageUrl
            }));
            await ProductImage.bulkCreate(imageRecords);
        }

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: { product_id: product.product_id }
        });
    } catch (error) {
        next(error);
    }
});

// Get categories
router.get('/categories/all', async (req, res, next) => {
    try {
        const categories = await Category.findAll({
            attributes: ['category_id', 'category_name'],
            order: [['category_name', 'ASC']]
        });

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
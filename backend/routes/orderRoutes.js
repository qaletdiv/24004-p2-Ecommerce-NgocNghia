const express = require('express');
const { Order, OrderDetails, Product, User } = require('../models');
const { authMiddleware } = require('../middlewares/auth');
const { validateOrder } = require('../validators/userValidator');

const router = express.Router();

// Create new order
router.post('/', authMiddleware, validateOrder, async (req, res, next) => {
    try {
        const { items, total_amount } = req.body;
        const userId = req.user.user_id;

        // Calculate total quantity and verify products exist
        let totalQuantity = 0;
        const productIds = items.map(item => item.product_id);
        
        const products = await Product.findAll({
            where: { product_id: productIds }
        });

        if (products.length !== productIds.length) {
            return res.status(400).json({
                success: false,
                error: { message: 'One or more products not found' }
            });
        }

        // Create order and order details in transaction
        const result = await sequelize.transaction(async (t) => {
            // Create order
            const order = await Order.create({
                user_id: userId,
                total_product_type: items.length,
                total_product_quantity: items.reduce((sum, item) => sum + item.quantity, 0),
                status: 'pending'
            }, { transaction: t });

            // Create order details
            const orderDetails = await Promise.all(
                items.map(async (item) => {
                    const product = products.find(p => p.product_id === item.product_id);
                    return OrderDetails.create({
                        order_id: order.order_id,
                        product_id: item.product_id,
                        product_quantity: item.quantity,
                        product_price: product.product_price,
                        product_category: 'General' // You might want to fetch this from the product's category
                    }, { transaction: t });
                })
            );

            return { order, orderDetails };
        });

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: {
                order_id: result.order.order_id,
                status: result.order.status,
                total_items: result.order.total_product_type,
                total_quantity: result.order.total_product_quantity
            }
        });

    } catch (error) {
        next(error);
    }
});

// Get user's orders
router.get('/my-orders', authMiddleware, async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const { count, rows: orders } = await Order.findAndCountAll({
            where: { user_id: req.user.user_id },
            include: [{
                model: OrderDetails,
                as: 'orderDetails',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['product_name', 'product_price']
                }]
            }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['order_id', 'DESC']]
        });

        const formattedOrders = orders.map(order => ({
            order_id: order.order_id,
            status: order.status,
            total_items: order.total_product_type,
            total_quantity: order.total_product_quantity,
            items: order.orderDetails.map(detail => ({
                product_name: detail.product.product_name,
                quantity: detail.product_quantity,
                price: detail.product_price,
                total: detail.product_price * detail.product_quantity
            })),
            total_amount: order.orderDetails.reduce((sum, detail) => 
                sum + (detail.product_price * detail.product_quantity), 0
            )
        }));

        res.json({
            success: true,
            data: {
                orders: formattedOrders,
                pagination: {
                    current_page: parseInt(page),
                    total_pages: Math.ceil(count / limit),
                    total_orders: count
                }
            }
        });

    } catch (error) {
        next(error);
    }
});

// Get specific order
router.get('/:id', authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;

        const order = await Order.findOne({
            where: { 
                order_id: id,
                user_id: req.user.user_id 
            },
            include: [{
                model: OrderDetails,
                as: 'orderDetails',
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['product_name', 'product_price']
                }]
            }]
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                error: { message: 'Order not found' }
            });
        }

        const formattedOrder = {
            order_id: order.order_id,
            status: order.status,
            total_items: order.total_product_type,
            total_quantity: order.total_product_quantity,
            items: order.orderDetails.map(detail => ({
                product_name: detail.product.product_name,
                quantity: detail.product_quantity,
                price: detail.product_price,
                total: detail.product_price * detail.product_quantity
            })),
            total_amount: order.orderDetails.reduce((sum, detail) => 
                sum + (detail.product_price * detail.product_quantity), 0
            )
        };

        res.json({
            success: true,
            data: formattedOrder
        });

    } catch (error) {
        next(error);
    }
});

// Update order status (admin only - you might want to add admin middleware)
router.patch('/:id/status', authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: { message: 'Invalid status' }
            });
        }

        const [updatedRows] = await Order.update(
            { status },
            { where: { order_id: id } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({
                success: false,
                error: { message: 'Order not found' }
            });
        }

        res.json({
            success: true,
            message: 'Order status updated successfully'
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;
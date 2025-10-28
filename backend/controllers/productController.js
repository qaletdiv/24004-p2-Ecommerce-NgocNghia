const {Product, Category} = require('../models')

exports.getAllProducts = async(req,res,next) => {
    try{
        const products = await Product.findAll({
            include: [
                {
                    model : Category,
                    as: 'category'
                }
            ]
        });
        res.json(products);
    }catch(error) {
        next(error);
    }
}

exports.getProductById = async (req,res,next) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [
                {
                    model: Category,
                    as: 'category'
                }
            ]
        });
        if (!product) {
            return res.status(404).json({message: 'Can not find the product'});
        }
        res.json(product);
    } catch(error) {
        next(error);
    }
}
exports.createProduct = async(req, res, next) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    }catch(error) {
        next(error);
    }
}
exports.updateProduct = async(req,res,next) => {
    try {
        const productId = req.params.product_id;
        const [updateRows] = await Product.update(req.body, {
            where: {product_id: productId},
        });
        /// No any rows is affected
        if (updateRows === 0) {
            return res.status(404).json({message: 'Can not find the product to update'});
        }
        /// updated product
        const updatedProduct = await Product.findByPk(productId);
        /// return the updated product
        res.json(updatedProduct);
    } catch(error) {
        next(error);
    }
}

exports.deleteProduct = async (req,res,next) => {
    try{
        const productId = req.params.product_id;
        const deleteRows = await Product.destroy({
            where: {product_id: productId},
        });
        if (deletedRows === 0) {
            return res.status(404).json({message: 'Can not find the product to delete'});
        }
        res.status(201).json({ message: 'product is sucessfully deleted'});
    } catch(error) {
        next(error);
    }
}
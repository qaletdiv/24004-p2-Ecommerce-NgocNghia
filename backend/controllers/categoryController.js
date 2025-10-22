const {Category, Product} = require('../models');

exports.getAllCategories = async (req,res,next) => {
    try {
        const categories = await Category.findAll ({
            include: [{
                model: Product,
                as: 'product'
            }]
        });
        res.json(categories);
    } catch(error) {
        next(error);
    }
}
exports.getCategoryById = async(req,res,next) => {
    try {
        const category = await Category.findByPk (req.params.id);
        if (!category) {
            return res.status(404).json({message: 'Can not find category'});
        }
        res.json(category);
    }catch(error) {
        next(error);
    }
}
exports.createCategory = async (req,res,next) => {
    try {
        const newCategory = await Category.create(req.body);
        res.status(201).json(newCategory);
    }catch(error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
               errors: [{
                    msg: 'Category existed',
                    param: 'name',
                    location: 'body'
               }]
            });
        }
        next(error);
    }
}
exports.updateCategory = async(req,res,next) => {
    try {
        const categoryId = req.params.category_id;
        const [updateRows] = await Category.update(req.body, {
            where: {id: categoryId},
        });
        if (updateRows === 0) {
            return res.status(404).json({message: 'Can not find category to update'});
        }
        const updatedCategory = await Category.findByPk(categoryId);
        res.json(updatedCategory);
    }catch(error) {
        next(error);
    }
}
exports.deleteCategory = async(req,res,next) =>{
    try {
        const categoryId = req.params.category_id;
        const deletedRows = await Category.destroy({
            where: {id: categoryId},
        });
        if (deletedRows === 0) {
            return res.json(404).json({message: 'Can not find category to delete'});
        }
        res.status(201).json({ message: 'product is sucessfully deleted'});
    }catch(error) {
        next(error);
    }
}
const {ProductImage} = require("../models");

exports.updateProductImage = async (req,res,next) => {
    if (!req.file || !req.file.processedFilename) {
        return res.status(400).json({message: "Please upload an image file"});
    }

    try {
        const productImagePath = `/uploads${req.file.processedFilename}`;
        const updateProductImage = await ProductImage.update(
            {productImage: productImagePath},
            {where: {id: req.product.product_image_id}}
        )
        res.status(200).json ({
            message: "Product image updated successfully!",
            data: {
                productUrl: productImagePath
            }
        });
    } catch(error) {
        next(error);
    }
}
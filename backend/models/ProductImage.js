module.exports = (sequelize, DataTypes) => {
    const ProductImage = sequelize.define('ProductImage', {
        product_image_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'products',
                key: 'product_id'
            }
        },
        product_image_link: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        tableName: 'product_image',
        timestamps: false
    });

    ProductImage.associate = (models) => {
        ProductImage.belongsTo(models.Product, {
            foreignKey: 'product_id',
            as: 'product'
        });
    };

    return ProductImage;
};
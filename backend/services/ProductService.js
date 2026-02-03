// services/ProductService.js
const Product = require('../models/ProductModel');

/**
 * Finds all products
 * @returns {Promise<Array>}
 */
const findAllProducts = async () => {
    return Product.find();
};

/**
 * Finds a product by ID
 * @param {string} productId - Product ID
 * @returns {Promise<ServiceResult>}
 */
const findProductById = async (productId) => {
    const product = await Product.findById(productId);
    if (!product) {
        return {
            success: false,
            error: 'PRODUCT_NOT_FOUND',
            message: 'Product not found',
            statusCode: 404,
        };
    }
    return {
        success: true,
        data: product,
        statusCode: 200,
    };
};

/**
 * Creates a new product
 * @param {Object} productData - Product data
 * @returns {Promise<ServiceResult>}
 */
const createProduct = async (productData) => {
    const { name, description, sku, quantity, price, category } = productData;
    const newProduct = new Product({ name, description, sku, quantity, price, category });
    const savedProduct = await newProduct.save();

    return {
        success: true,
        data: savedProduct,
        statusCode: 201,
    };
};

/**
 * Updates a product
 * @param {string} productId - Product ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<ServiceResult>}
 */
const updateProduct = async (productId, updateData) => {
    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updateData,
        { new: true, runValidators: true },
    );

    if (!updatedProduct) {
        return {
            success: false,
            error: 'PRODUCT_NOT_FOUND',
            message: 'Product not found',
            statusCode: 404,
        };
    }

    return {
        success: true,
        data: updatedProduct,
        statusCode: 200,
    };
};

/**
 * Deletes a product
 * @param {string} productId - Product ID
 * @returns {Promise<ServiceResult>}
 */
const deleteProduct = async (productId) => {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
        return {
            success: false,
            error: 'PRODUCT_NOT_FOUND',
            message: 'Product not found',
            statusCode: 404,
        };
    }
    return {
        success: true,
        message: 'Product deleted successfully',
        statusCode: 200,
    };
};

/**
 * Finds products by category
 * @param {string} categoryId - Category ID
 * @returns {Promise<Array>}
 */
const findProductsByCategory = async (categoryId) => {
    return Product.find({ category: categoryId });
};

/**
 * Finds products by price range
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {Promise<Array>}
 */
const findProductsByPriceRange = async (minPrice, maxPrice) => {
    return Product.find({
        price: { $gte: minPrice, $lte: maxPrice },
    });
};

module.exports = {
    findAllProducts,
    findProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    findProductsByCategory,
    findProductsByPriceRange,
};

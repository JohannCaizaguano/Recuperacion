// validators/TransactionValidator.js
const Product = require('../models/ProductModel');

/**
 * Validation result structure
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether validation passed
 * @property {string} [error] - Error code if validation failed
 * @property {string} [message] - Human-readable error message
 * @property {*} [details] - Additional error details
 */

/**
 * Validates required fields for transaction creation
 * @param {Object} data - Transaction input data
 * @returns {ValidationResult}
 */
const validateTransactionInput = (data) => {
    const { user, products, totalPrice } = data;

    if (!user || !products || !totalPrice) {
        return {
            isValid: false,
            error: 'MISSING_REQUIRED_FIELDS',
            message: 'User, products, and totalPrice are required for creating a transaction',
        };
    }

    if (!Array.isArray(products) || products.length === 0) {
        return {
            isValid: false,
            error: 'INVALID_PRODUCTS',
            message: 'Products must be a non-empty array',
        };
    }

    return { isValid: true };
};

/**
 * Validates that all products exist in the database
 * @param {Array} productIds - Array of product IDs to validate
 * @returns {Promise<ValidationResult>}
 */
const validateProductsExist = async (productIds) => {
    const existingProducts = await Product.find({ _id: { $in: productIds } }).select('_id');
    const existingIds = existingProducts.map((p) => p._id.toString());
    const missingIds = productIds.filter((id) => !existingIds.includes(id.toString()));

    if (missingIds.length > 0) {
        return {
            isValid: false,
            error: 'PRODUCTS_NOT_FOUND',
            message: 'One or more products not found',
            details: { missingProducts: missingIds },
        };
    }

    return {
        isValid: true,
        existingProducts,
    };
};

/**
 * Validates stock availability for all products within a session
 * @param {Array} products - Array of { product, quantity } objects
 * @param {Object} session - MongoDB session for atomic operations
 * @returns {Promise<ValidationResult>}
 */
const validateStockAvailability = async (products, session) => {
    const insufficientStock = [];

    for (const item of products) {
        const product = await Product.findById(item.product).session(session);

        if (!product) {
            return {
                isValid: false,
                error: 'PRODUCT_NOT_FOUND',
                message: `Product with ID ${item.product} not found`,
            };
        }

        if (product.quantity < item.quantity) {
            insufficientStock.push({
                productId: item.product,
                productName: product.name,
                requested: item.quantity,
                available: product.quantity,
            });
        }
    }

    if (insufficientStock.length > 0) {
        return {
            isValid: false,
            error: 'INSUFFICIENT_STOCK',
            message: 'Insufficient stock for one or more products',
            details: insufficientStock,
        };
    }

    return { isValid: true };
};

module.exports = {
    validateTransactionInput,
    validateProductsExist,
    validateStockAvailability,
};

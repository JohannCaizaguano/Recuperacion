// services/TransactionService.js
const mongoose = require('mongoose');
const Transaction = require('../models/TransactionModel');
const Product = require('../models/ProductModel');
const {
    validateTransactionInput,
    validateProductsExist,
    validateStockAvailability,
} = require('../validators/TransactionValidator');

/**
 * Service result structure
 * @typedef {Object} ServiceResult
 * @property {boolean} success - Whether operation succeeded
 * @property {*} [data] - Result data if successful
 * @property {string} [error] - Error code if failed
 * @property {string} [message] - Human-readable message
 * @property {*} [details] - Additional details
 */

/**
 * Updates stock for all products atomically
 * @param {Array} products - Array of { product, quantity } objects
 * @param {Object} session - MongoDB session
 * @returns {Promise<void>}
 */
const updateStock = async (products, session) => {
    for (const item of products) {
        await Product.findByIdAndUpdate(
            item.product,
            { $inc: { quantity: -item.quantity } },
            { session },
        );
    }
};

/**
 * Creates a transaction with atomic stock validation and update
 * @param {Object} transactionData - Transaction data
 * @returns {Promise<ServiceResult>}
 */
const createTransactionWithStockUpdate = async (transactionData) => {
    // 1. Validate input synchronously
    const inputValidation = validateTransactionInput(transactionData);
    if (!inputValidation.isValid) {
        return {
            success: false,
            error: inputValidation.error,
            message: inputValidation.message,
            statusCode: 400,
        };
    }

    // 2. Validate products exist (before starting session)
    const productIds = transactionData.products.map((p) => p.product);
    const productsValidation = await validateProductsExist(productIds);
    if (!productsValidation.isValid) {
        return {
            success: false,
            error: productsValidation.error,
            message: productsValidation.message,
            details: productsValidation.details,
            statusCode: 404,
        };
    }

    // 3. Start session for atomic operations
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 4. Validate stock availability within session
        const stockValidation = await validateStockAvailability(
            transactionData.products,
            session,
        );

        if (!stockValidation.isValid) {
            await session.abortTransaction();
            session.endSession();

            const statusCode = stockValidation.error === 'INSUFFICIENT_STOCK' ? 400 : 404;
            return {
                success: false,
                error: stockValidation.error,
                message: stockValidation.message,
                details: stockValidation.details,
                statusCode,
            };
        }

        // 5. Update stock atomically
        await updateStock(transactionData.products, session);

        // 6. Create and save transaction
        const { user, products, totalPrice, transactionDate } = transactionData;
        const newTransaction = new Transaction({
            user,
            products,
            totalPrice,
            transactionDate,
        });
        const savedTransaction = await newTransaction.save({ session });

        // 7. Commit transaction
        await session.commitTransaction();
        session.endSession();

        return {
            success: true,
            data: savedTransaction,
            statusCode: 201,
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return {
            success: false,
            error: 'TRANSACTION_ERROR',
            message: error.message,
            statusCode: 400,
        };
    }
};

/**
 * Helper function for turnover aggregation
 * Reduces CPU by using a single optimized pipeline
 * @returns {Promise<Array>}
 */
const calculateTurnoverMetrics = async () => {
    return Transaction.aggregate([
        {
            $group: {
                _id: null,
                totalTurnover: { $sum: '$totalPrice' },
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                totalTurnover: 1,
                count: 1,
            },
        },
    ]).allowDiskUse(true);
};

/**
 * Gets dashboard analytics data
 * @returns {Promise<Object>}
 */
const getDashboardAnalytics = async () => {
    const [metricsResult, recentTransactions] = await Promise.all([
        calculateTurnoverMetrics(),
        Transaction.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('user totalPrice createdAt products')
            .populate('user', 'username')
            .lean(),
    ]);

    const metrics = metricsResult[0] || { totalTurnover: 0, count: 0 };

    return {
        totalTurnover: metrics.totalTurnover,
        transactionCount: metrics.count,
        recentTransactions,
    };
};

/**
 * Gets total turnover metrics
 * @returns {Promise<Object>}
 */
const getTurnoverMetrics = async () => {
    const result = await calculateTurnoverMetrics();
    const metrics = result[0] || { totalTurnover: 0, count: 0 };

    return {
        totalTurnover: metrics.totalTurnover,
        transactionCount: metrics.count,
    };
};

module.exports = {
    createTransactionWithStockUpdate,
    calculateTurnoverMetrics,
    getDashboardAnalytics,
    getTurnoverMetrics,
};

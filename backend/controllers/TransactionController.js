// controllers/TransactionController.js
const mongoose = require('mongoose');
const Transaction = require('../models/TransactionModel');
const Product = require('../models/ProductModel');

/**
 * Validates that all products exist in the database
 * @param {Array} productIds - Array of product IDs to validate
 * @returns {Object} - Object with isValid boolean and missing products array
 */
const validateProductsExist = async (productIds) => {
    const existingProducts = await Product.find({ _id: { $in: productIds } }).select('_id');
    const existingIds = existingProducts.map((p) => p._id.toString());
    const missingIds = productIds.filter((id) => !existingIds.includes(id.toString()));

    return {
        isValid: missingIds.length === 0,
        missingProducts: missingIds,
        existingProducts,
    };
};

/**
 * Validates stock availability and updates it atomically within a session
 * @param {Array} products - Array of { product, quantity } objects
 * @param {Object} session - MongoDB session for atomic operations
 * @returns {Object} - Object with success boolean and error details if any
 */
const validateAndUpdateStock = async (products, session) => {
    const insufficientStock = [];

    for (const item of products) {
        const product = await Product.findById(item.product).session(session);

        if (!product) {
            return {
                success: false,
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
            success: false,
            error: 'INSUFFICIENT_STOCK',
            message: 'Insufficient stock for one or more products',
            details: insufficientStock,
        };
    }

    // Update stock for all products atomically
    for (const item of products) {
        await Product.findByIdAndUpdate(
            item.product,
            { $inc: { quantity: -item.quantity } },
            { session },
        );
    }

    return { success: true };
};

const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTransaction = async (req, res) => {
    // Start a MongoDB session for atomic operations
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { user, products, totalPrice, transactionDate } = req.body;

        // 1. Validate required fields
        if (!user || !products || !totalPrice) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                message: 'User, products, and totalPrice are required for creating a transaction',
            });
        }

        if (!Array.isArray(products) || products.length === 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                message: 'Products must be a non-empty array',
            });
        }

        // 2. Extract product IDs and validate they exist
        const productIds = products.map((p) => p.product);
        const validation = await validateProductsExist(productIds);

        if (!validation.isValid) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                message: 'One or more products not found',
                missingProducts: validation.missingProducts,
            });
        }

        // 3. Validate stock availability and update atomically
        const stockResult = await validateAndUpdateStock(products, session);

        if (!stockResult.success) {
            await session.abortTransaction();
            session.endSession();

            if (stockResult.error === 'INSUFFICIENT_STOCK') {
                return res.status(400).json({
                    message: stockResult.message,
                    insufficientStock: stockResult.details,
                });
            }

            return res.status(404).json({ message: stockResult.message });
        }

        // 4. Create and save the transaction within the session
        const newTransaction = new Transaction({
            user,
            products,
            totalPrice,
            transactionDate,
        });
        const savedTransaction = await newTransaction.save({ session });

        // 5. Commit the transaction
        await session.commitTransaction();
        session.endSession();

        res.status(201).json(savedTransaction);
    } catch (error) {
        // Rollback on any error
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: error.message });
    }
};

const updateTransaction = async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true },
        );
        if (!updatedTransaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json(updatedTransaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
        if (!deletedTransaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Helper function for turnover aggregation
 * Reduces CPU by using a single optimized pipeline
 * @returns {Promise<Array>} - Array with metrics object containing totalTurnover and count
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

// Get total turnover (sum of all transaction amounts)
const getTotalTurnover = async (req, res) => {
    try {
        const result = await calculateTurnoverMetrics();
        const metrics = result[0] || { totalTurnover: 0, count: 0 };

        res.json({
            totalTurnover: metrics.totalTurnover,
            transactionCount: metrics.count,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get dashboard analytics
const getDashboardAnalytics = async (req, res) => {
    try {
        const [metricsResult, recentTransactions] = await Promise.all([
            calculateTurnoverMetrics(),
            Transaction.find()
                .sort({ createdAt: -1 })
                .limit(5)
                .select('user totalPrice createdAt products') // Limit fields for better performance
                .populate('user', 'username')
                .lean(), // Use lean() for read-only performance (30-50% faster)
        ]);

        const metrics = metricsResult[0] || { totalTurnover: 0, count: 0 };

        res.json({
            totalTurnover: metrics.totalTurnover,
            transactionCount: metrics.count,
            recentTransactions,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getTotalTurnover,
    getDashboardAnalytics,
};

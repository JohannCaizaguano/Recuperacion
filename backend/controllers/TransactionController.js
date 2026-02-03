// controllers/TransactionController.js
const Transaction = require('../models/TransactionModel');
const {
    createTransactionWithStockUpdate,
    getDashboardAnalytics,
    getTurnoverMetrics,
} = require('../services/TransactionService');

/**
 * Get all transactions
 */
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get transaction by ID
 */
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

/**
 * Create a new transaction with atomic stock validation
 * Delegates validation to TransactionValidator and business logic to TransactionService
 */
const createTransaction = async (req, res) => {
    try {
        const result = await createTransactionWithStockUpdate(req.body);

        if (!result.success) {
            const response = { message: result.message };

            // Add additional details based on error type
            if (result.error === 'PRODUCTS_NOT_FOUND') {
                response.missingProducts = result.details?.missingProducts;
            } else if (result.error === 'INSUFFICIENT_STOCK') {
                response.insufficientStock = result.details;
            }

            return res.status(result.statusCode).json(response);
        }

        res.status(201).json(result.data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Update a transaction
 */
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

/**
 * Delete a transaction
 */
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
 * Get total turnover (sum of all transaction amounts)
 * Delegates to TransactionService
 */
const getTotalTurnover = async (req, res) => {
    try {
        const metrics = await getTurnoverMetrics();
        res.json(metrics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get dashboard analytics
 * Delegates to TransactionService
 */
const getDashboardAnalyticsHandler = async (req, res) => {
    try {
        const analytics = await getDashboardAnalytics();
        res.json(analytics);
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
    getDashboardAnalytics: getDashboardAnalyticsHandler,
};

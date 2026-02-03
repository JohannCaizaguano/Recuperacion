// controllers/OrderController.js
const {
    findAllOrders,
    findOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
} = require('../services/OrderService');

/**
 * Get all orders
 */
const getAllOrders = async (req, res) => {
    try {
        const orders = await findAllOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get order by ID
 */
const getOrderById = async (req, res) => {
    try {
        const result = await findOrderById(req.params.id);

        if (!result.success) {
            return res.status(result.statusCode).json({ message: result.message });
        }

        res.json(result.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Create order
 */
const createOrderHandler = async (req, res) => {
    try {
        const result = await createOrder(req.body);

        if (!result.success) {
            return res.status(result.statusCode).json({ message: result.message });
        }

        res.status(201).json(result.data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Update order
 */
const updateOrderHandler = async (req, res) => {
    try {
        const result = await updateOrder(req.params.id, req.body);

        if (!result.success) {
            return res.status(result.statusCode).json({ message: result.message });
        }

        res.json(result.data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Delete order
 */
const deleteOrderHandler = async (req, res) => {
    try {
        const result = await deleteOrder(req.params.id);

        if (!result.success) {
            return res.status(result.statusCode).json({ message: result.message });
        }

        res.json({ message: result.message });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder: createOrderHandler,
    updateOrder: updateOrderHandler,
    deleteOrder: deleteOrderHandler,
};

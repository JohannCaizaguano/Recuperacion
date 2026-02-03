// services/OrderService.js
const Order = require('../models/OrderModel');

/**
 * Finds all orders
 * @returns {Promise<Array>}
 */
const findAllOrders = async () => {
    return Order.find();
};

/**
 * Finds an order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<ServiceResult>}
 */
const findOrderById = async (orderId) => {
    const order = await Order.findById(orderId);
    if (!order) {
        return {
            success: false,
            error: 'ORDER_NOT_FOUND',
            message: 'Order not found',
            statusCode: 404,
        };
    }
    return {
        success: true,
        data: order,
        statusCode: 200,
    };
};

/**
 * Creates a new order
 * @param {Object} orderData - Order data
 * @returns {Promise<ServiceResult>}
 */
const createOrder = async (orderData) => {
    const { products, totalAmount } = orderData;

    if (!products || !totalAmount) {
        return {
            success: false,
            error: 'MISSING_REQUIRED_FIELDS',
            message: 'Products and totalAmount are required',
            statusCode: 400,
        };
    }

    const newOrder = new Order({ products, totalAmount });
    const savedOrder = await newOrder.save();

    return {
        success: true,
        data: savedOrder,
        statusCode: 201,
    };
};

/**
 * Updates an order
 * @param {string} orderId - Order ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<ServiceResult>}
 */
const updateOrder = async (orderId, updateData) => {
    const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        updateData,
        { new: true, runValidators: true },
    );

    if (!updatedOrder) {
        return {
            success: false,
            error: 'ORDER_NOT_FOUND',
            message: 'Order not found',
            statusCode: 404,
        };
    }

    return {
        success: true,
        data: updatedOrder,
        statusCode: 200,
    };
};

/**
 * Deletes an order
 * @param {string} orderId - Order ID
 * @returns {Promise<ServiceResult>}
 */
const deleteOrder = async (orderId) => {
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
        return {
            success: false,
            error: 'ORDER_NOT_FOUND',
            message: 'Order not found',
            statusCode: 404,
        };
    }
    return {
        success: true,
        message: 'Order deleted successfully',
        statusCode: 200,
    };
};

/**
 * Calculates the total amount for products
 * @param {Array} products - Array of { product, quantity, price } objects
 * @returns {number}
 */
const calculateTotal = (products) => {
    return products.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

module.exports = {
    findAllOrders,
    findOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    calculateTotal,
};

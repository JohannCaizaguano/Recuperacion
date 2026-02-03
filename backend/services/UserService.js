// services/UserService.js
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const { jwtSecret, jwtExpiresIn } = require('../config/config');

/**
 * Service result structure
 * @typedef {Object} ServiceResult
 * @property {boolean} success
 * @property {*} [data]
 * @property {string} [error]
 * @property {string} [message]
 * @property {number} [statusCode]
 */

/**
 * Generates a JWT token for a user
 * @param {string} userId - User ID
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
    return jwt.sign({ userId }, jwtSecret, { expiresIn: jwtExpiresIn });
};

/**
 * Finds a user by email and validates password
 * @param {string} email - User email
 * @param {string} password - Plain text password
 * @returns {Promise<ServiceResult>}
 */
const findUserByCredentials = async (email, password) => {
    if (!email || !password) {
        return {
            success: false,
            error: 'MISSING_CREDENTIALS',
            message: 'Email and password are required.',
            statusCode: 400,
        };
    }

    const user = await User.findOne({ email });
    if (!user) {
        return {
            success: false,
            error: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password.',
            statusCode: 401,
        };
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return {
            success: false,
            error: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password.',
            statusCode: 401,
        };
    }

    const token = generateToken(user._id);
    return {
        success: true,
        data: { user, token },
        statusCode: 200,
    };
};

/**
 * Creates a new user with duplicate validation
 * @param {Object} userData - User data
 * @returns {Promise<ServiceResult>}
 */
const createUser = async (userData) => {
    const { username, password, email, role } = userData;

    // Check for existing user
    const existingUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (existingUser) {
        return {
            success: false,
            error: 'USER_EXISTS',
            message: 'User with this email or username already exists.',
            statusCode: 400,
        };
    }

    const user = new User({ username, password, email, role });
    await user.save();

    const token = generateToken(user._id);
    return {
        success: true,
        data: { user, token },
        statusCode: 201,
    };
};

/**
 * Finds all users
 * @returns {Promise<Array>}
 */
const findAllUsers = async () => {
    return User.find();
};

/**
 * Finds a user by ID
 * @param {string} userId - User ID
 * @returns {Promise<ServiceResult>}
 */
const findUserById = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        return {
            success: false,
            error: 'USER_NOT_FOUND',
            message: 'User not found',
            statusCode: 404,
        };
    }
    return {
        success: true,
        data: user,
        statusCode: 200,
    };
};

/**
 * Updates a user
 * @param {string} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<ServiceResult>}
 */
const updateUser = async (userId, updateData) => {
    const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true },
    );

    if (!updatedUser) {
        return {
            success: false,
            error: 'USER_NOT_FOUND',
            message: 'User not found',
            statusCode: 404,
        };
    }

    return {
        success: true,
        data: updatedUser,
        statusCode: 200,
    };
};

/**
 * Deletes a user
 * @param {string} userId - User ID
 * @returns {Promise<ServiceResult>}
 */
const deleteUser = async (userId) => {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
        return {
            success: false,
            error: 'USER_NOT_FOUND',
            message: 'User not found',
            statusCode: 404,
        };
    }
    return {
        success: true,
        message: 'User deleted successfully',
        statusCode: 200,
    };
};

module.exports = {
    generateToken,
    findUserByCredentials,
    createUser,
    findAllUsers,
    findUserById,
    updateUser,
    deleteUser,
};

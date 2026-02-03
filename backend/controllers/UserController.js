// controllers/UserController.js
const {
    findUserByCredentials,
    createUser,
    findAllUsers,
    findUserById,
    updateUser,
    deleteUser,
} = require('../services/UserService');

/**
 * Register new user
 */
const register = async (req, res) => {
    try {
        const result = await createUser(req.body);

        if (!result.success) {
            return res.status(result.statusCode).json({ message: result.message });
        }

        res.status(201).json(result.data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Login user
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await findUserByCredentials(email, password);

        if (!result.success) {
            return res.status(result.statusCode).json({ message: result.message });
        }

        res.json(result.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res) => {
    res.json(req.user);
};

/**
 * Get all users
 */
const getAllUsers = async (req, res) => {
    try {
        const users = await findAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get user by ID
 */
const getUserById = async (req, res) => {
    try {
        const result = await findUserById(req.params.id);

        if (!result.success) {
            return res.status(result.statusCode).json({ message: result.message });
        }

        res.json(result.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Create user (admin)
 */
const createUserHandler = async (req, res) => {
    try {
        const result = await createUser(req.body);

        if (!result.success) {
            return res.status(result.statusCode).json({ message: result.message });
        }

        res.status(201).json(result.data.user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Update user
 */
const updateUserHandler = async (req, res) => {
    try {
        const result = await updateUser(req.params.id, req.body);

        if (!result.success) {
            return res.status(result.statusCode).json({ message: result.message });
        }

        res.json(result.data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Delete user
 */
const deleteUserHandler = async (req, res) => {
    try {
        const result = await deleteUser(req.params.id);

        if (!result.success) {
            return res.status(result.statusCode).json({ message: result.message });
        }

        res.json({ message: result.message });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    getAllUsers,
    getUserById,
    createUser: createUserHandler,
    updateUser: updateUserHandler,
    deleteUser: deleteUserHandler,
};

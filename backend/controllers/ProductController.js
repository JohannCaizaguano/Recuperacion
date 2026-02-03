// controllers/ProductController.js
const {
    findAllProducts,
    findProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../services/ProductService');

/**
 * Get all products
 */
const getAllProducts = async (req, res) => {
    try {
        const products = await findAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get product by ID
 */
const getProductById = async (req, res) => {
    try {
        const result = await findProductById(req.params.id);

        if (!result.success) {
            return res.status(result.statusCode).json({ message: result.message });
        }

        res.json(result.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Create product
 */
const createProductHandler = async (req, res) => {
    try {
        const result = await createProduct(req.body);

        if (!result.success) {
            return res.status(result.statusCode).json({ message: result.message });
        }

        res.status(201).json(result.data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Update product
 */
const updateProductHandler = async (req, res) => {
    try {
        const result = await updateProduct(req.params.id, req.body);

        if (!result.success) {
            return res.status(result.statusCode).json({ message: result.message });
        }

        res.json(result.data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

/**
 * Delete product
 */
const deleteProductHandler = async (req, res) => {
    try {
        const result = await deleteProduct(req.params.id);

        if (!result.success) {
            return res.status(result.statusCode).json({ message: result.message });
        }

        res.json({ message: result.message });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct: createProductHandler,
    updateProduct: updateProductHandler,
    deleteProduct: deleteProductHandler,
};

// middleware/errorHandler.js

/**
 * Standard error codes for the application
 */
const ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
    BAD_REQUEST: 'BAD_REQUEST',
};

/**
 * Custom application error class
 */
class AppError extends Error {
    constructor(message, statusCode, errorCode) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Centralized error handler middleware
 * Handles all errors thrown in the application
 */
const errorHandler = (err, req, res, _next) => {
    // Default values
    let statusCode = err.statusCode || 500;
    let errorCode = err.errorCode || ERROR_CODES.INTERNAL_ERROR;
    let message = err.message || 'Internal server error';

    // Handle MongoDB duplicate key error
    if (err.code === 11000) {
        statusCode = 400;
        errorCode = ERROR_CODES.DUPLICATE_ENTRY;
        const field = Object.keys(err.keyValue)[0];
        message = `Duplicate value for field: ${field}`;
    }

    // Handle MongoDB validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        errorCode = ERROR_CODES.VALIDATION_ERROR;
        const errors = Object.values(err.errors).map((e) => e.message);
        message = errors.join(', ');
    }

    // Handle MongoDB CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400;
        errorCode = ERROR_CODES.BAD_REQUEST;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        errorCode = ERROR_CODES.UNAUTHORIZED;
        message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        errorCode = ERROR_CODES.UNAUTHORIZED;
        message = 'Token expired';
    }

    // Handle CORS errors
    if (err.message && err.message.includes('CORS')) {
        statusCode = 403;
        errorCode = ERROR_CODES.FORBIDDEN;
        message = err.message;
        console.error('[CORS Error]', {
            origin: req.get('origin'),
            referer: req.get('referer'),
            method: req.method,
            path: req.path,
        });
    }

    // Log error in development
    if (process.env.NODE_ENV !== 'production') {
        console.error('Error:', {
            message: err.message,
            stack: err.stack,
            statusCode,
            errorCode,
        });
    }

    // Send error response
    res.status(statusCode).json({
        success: false,
        message,
        errorCode,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
};

/**
 * Async handler wrapper to catch errors in async routes
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Not found handler for undefined routes
 */
const notFoundHandler = (req, res, next) => {
    const error = new AppError(
        `Cannot ${req.method} ${req.originalUrl}`,
        404,
        ERROR_CODES.NOT_FOUND,
    );
    next(error);
};

module.exports = {
    errorHandler,
    asyncHandler,
    notFoundHandler,
    AppError,
    ERROR_CODES,
};

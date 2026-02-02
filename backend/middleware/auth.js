const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const { jwtSecret } = require('../config/config');

/**
 * Error codes for authentication failures
 * Useful for debugging and client-side error handling
 */
const AUTH_ERROR_CODES = {
    NO_TOKEN: 'AUTH_NO_TOKEN',
    INVALID_BEARER_FORMAT: 'AUTH_INVALID_BEARER_FORMAT',
    INVALID_TOKEN: 'AUTH_INVALID_TOKEN',
    TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
    USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
    USER_INACTIVE: 'AUTH_USER_INACTIVE',
    AUTH_ERROR: 'AUTH_ERROR'
};

/**
 * Regex pattern for validating Bearer token format
 * Matches: "Bearer " followed by a non-empty token string
 */
const BEARER_REGEX = /^Bearer\s+(.+)$/i;

/**
 * Authentication middleware
 * Validates JWT tokens and attaches user to request
 * 
 * Status codes:
 * - 401: Token-related issues (missing, invalid, expired)
 * - 403: Access denied (user not found or inactive)
 * - 500: Internal server error
 */
const auth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        // Check if Authorization header exists
        if (!authHeader) {
            return res.status(401).json({
                message: 'Access denied. No token provided.',
                errorCode: AUTH_ERROR_CODES.NO_TOKEN
            });
        }

        // Validate Bearer token format using regex for robustness
        const trimmedHeader = authHeader.trim();
        const match = trimmedHeader.match(BEARER_REGEX);

        if (!match) {
            return res.status(401).json({
                message: 'Access denied. Invalid authorization format. Expected: Bearer <token>',
                errorCode: AUTH_ERROR_CODES.INVALID_BEARER_FORMAT
            });
        }

        // Extract token from regex match group
        const token = match[1].trim();

        // Verify token is not empty after extraction
        if (!token) {
            return res.status(401).json({
                message: 'Access denied. Token is empty.',
                errorCode: AUTH_ERROR_CODES.NO_TOKEN
            });
        }

        // Verify JWT token
        let decoded;
        try {
            decoded = jwt.verify(token, jwtSecret);
        } catch (jwtError) {
            // Handle specific JWT errors with appropriate status codes and messages
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    message: 'Token expired. Please log in again.',
                    errorCode: AUTH_ERROR_CODES.TOKEN_EXPIRED,
                    expiredAt: jwtError.expiredAt
                });
            }
            if (jwtError.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    message: 'Invalid token. Token malformed or signature verification failed.',
                    errorCode: AUTH_ERROR_CODES.INVALID_TOKEN
                });
            }
            if (jwtError.name === 'NotBeforeError') {
                return res.status(401).json({
                    message: 'Token not yet active.',
                    errorCode: AUTH_ERROR_CODES.INVALID_TOKEN
                });
            }
            // Re-throw unknown JWT errors
            throw jwtError;
        }

        // Validate decoded payload has required fields
        if (!decoded.userId) {
            return res.status(401).json({
                message: 'Invalid token. Missing user identifier.',
                errorCode: AUTH_ERROR_CODES.INVALID_TOKEN
            });
        }

        // Fetch user from database
        const user = await User.findById(decoded.userId);

        // User not found - use 403 to differentiate from token issues
        // This is a different error than token problems: the token is valid,
        // but the user no longer exists in the system
        if (!user) {
            return res.status(403).json({
                message: 'Access denied. User not found.',
                errorCode: AUTH_ERROR_CODES.USER_NOT_FOUND
            });
        }

        // Optional: Check if user account is active (if such field exists)
        if (user.isActive === false) {
            return res.status(403).json({
                message: 'Access denied. User account is deactivated.',
                errorCode: AUTH_ERROR_CODES.USER_INACTIVE
            });
        }

        // Attach user and token to request object
        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        // Log unexpected errors for debugging (in production, use proper logging)
        console.error('Authentication middleware error:', error.message);

        res.status(500).json({
            message: 'Internal authentication error.',
            errorCode: AUTH_ERROR_CODES.AUTH_ERROR
        });
    }
};

// Role-based authorization middleware
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authenticated.' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }
        next();
    };
};

module.exports = { auth, authorize, AUTH_ERROR_CODES };

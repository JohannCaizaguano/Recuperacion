require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Custom routes imports
const productRoutes = require('./routes/ProductRoutes');
const userRoutes = require('./routes/UserRoutes');
const orderRoutes = require('./routes/OrderRoutes');
const categoryRoutes = require('./routes/CategoryRoutes');
const transactionRoutes = require('./routes/TransactionRoutes');
const inventoryRoutes = require('./routes/InventoryRoutes');

const app = express();

// Middleware
const whitelist = [
    'http://localhost',
    'http://localhost:80',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
    'http://127.0.0.1',
    'http://127.0.0.1:80',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:8080',
    'http://172.21.0.1',
    // Agregar más orígenes según sea necesario
    process.env.FRONTEND_URL,
].filter(Boolean); // Eliminar valores undefined/null

const corsOptions = {
    origin: function (origin, callback) {
        // Log para debugging de CORS
        if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
            console.log(`[CORS] Petición desde origen: ${origin || 'sin origen (mismo servidor o herramienta)'}`);
        }

        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) {
            return callback(null, true);
        }

        // En desarrollo, permitir todos los orígenes localhost
        if (process.env.NODE_ENV !== 'production') {
            if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
                return callback(null, true);
            }
        }

        // Verificar whitelist
        if (whitelist.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`[CORS] ⚠️ Origen bloqueado: ${origin}`);
            console.warn(`[CORS] Orígenes permitidos: ${whitelist.join(', ')}`);
            callback(new Error(`CORS: Origen no permitido - ${origin}`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-Origin'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400, // Cache preflight por 24 horas
    optionsSuccessStatus: 200, // Para navegadores legacy
};

// Manejar preflight para todas las rutas
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));

// Only use morgan in non-test environment
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/categories', categoryRoutes);
app.use('/transactions', transactionRoutes);
app.use('/inventory', inventoryRoutes);

// Default route
app.get('/', (req, res) => {
    res.json({
        message: 'StockFlow API',
        version: '1.0.0',
        docs: '/api-docs',
    });
});

// 404 handler
app.use(notFoundHandler);

// Centralized error handling middleware
app.use(errorHandler);

module.exports = app;

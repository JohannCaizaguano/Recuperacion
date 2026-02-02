import axios from 'axios';

// Configuración de URL base con soporte para HTTPS en producción
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Configuración de reintentos para errores de red
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

/**
 * Instancia de Axios configurada para políticas estrictas de CORS
 * y compatibilidad con SSL/TLS en servidores Nginx de producción
 */
const api = axios.create({
    baseURL: API_URL,
    timeout: 30000, // Timeout de 30 segundos para producción
    withCredentials: true, // Habilitar envío de cookies en peticiones cross-origin
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Headers adicionales para compatibilidad con proxy Nginx
        'X-Requested-With': 'XMLHttpRequest',
    },
    // Validar certificados SSL en producción
    ...(process.env.NODE_ENV === 'production' && {
        httpsAgent: { rejectUnauthorized: true }
    }),
});

/**
 * Función auxiliar para reintentar peticiones fallidas por errores de red
 */
const retryRequest = async (error, retryCount = 0) => {
    const config = error.config;

    // Solo reintentar en errores de red o timeout, no en errores HTTP
    const isNetworkError = !error.response && error.code !== 'ECONNABORTED';
    const isTimeoutError = error.code === 'ECONNABORTED';

    if ((isNetworkError || isTimeoutError) && retryCount < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
        config._retryCount = retryCount + 1;
        return api.request(config);
    }

    return Promise.reject(error);
};

// Interceptor de peticiones: añade token y headers de seguridad
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Añadir header de origen para validación CORS en el servidor
        if (process.env.NODE_ENV === 'production') {
            config.headers['X-Origin'] = window.location.origin;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de respuestas: manejo de errores de autenticación y red
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Manejo de errores de CORS
        if (error.message === 'Network Error' && !error.response) {
            console.error('Error de CORS o conexión de red. Verifique la configuración del servidor.');

            // Intentar reintentar la petición
            const retryCount = error.config?._retryCount || 0;
            if (retryCount < MAX_RETRIES) {
                return retryRequest(error, retryCount);
            }
        }

        // Manejo de errores SSL/TLS
        if (error.code === 'ERR_CERT_AUTHORITY_INVALID' ||
            error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
            console.error('Error de certificado SSL/TLS. Verifique la configuración del servidor.');
        }

        // Manejo de errores de autenticación (401 Unauthorized)
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Evitar redirección en bucle
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        // Manejo de errores de CORS desde el servidor (403 Forbidden por CORS)
        if (error.response?.status === 403) {
            const corsError = error.response.headers?.['access-control-allow-origin'];
            if (!corsError) {
                console.error('Acceso denegado. Posible error de configuración CORS en el servidor.');
            }
        }

        return Promise.reject(error);
    }
);

// Auth endpoints
export const authAPI = {
    login: (email, password) => api.post('/users/login', { email, password }),
    register: (data) => api.post('/users/register', data),
    getProfile: () => api.get('/users/profile'),
};

// Products endpoints
export const productsAPI = {
    getAll: () => api.get('/products'),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
};

// Categories endpoints
export const categoriesAPI = {
    getAll: () => api.get('/categories'),
    getById: (id) => api.get(`/categories/${id}`),
    create: (data) => api.post('/categories', data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
};

// Orders endpoints
export const ordersAPI = {
    getAll: () => api.get('/orders'),
    getById: (id) => api.get(`/orders/${id}`),
    create: (data) => api.post('/orders', data),
    update: (id, data) => api.put(`/orders/${id}`, data),
    delete: (id) => api.delete(`/orders/${id}`),
};

// Transactions endpoints
export const transactionsAPI = {
    getAll: () => api.get('/transactions'),
    getById: (id) => api.get(`/transactions/${id}`),
    create: (data) => api.post('/transactions', data),
    update: (id, data) => api.put(`/transactions/${id}`, data),
    delete: (id) => api.delete(`/transactions/${id}`),
    getTotalTurnover: () => api.get('/transactions/analytics/total-turnover'),
};

// Inventory endpoints
export const inventoryAPI = {
    getAll: () => api.get('/inventory'),
    getById: (id) => api.get(`/inventory/${id}`),
    create: (data) => api.post('/inventory', data),
    update: (id, data) => api.put(`/inventory/${id}`, data),
    delete: (id) => api.delete(`/inventory/${id}`),
};

export default api;

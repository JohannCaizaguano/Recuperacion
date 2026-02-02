const mongoose = require('mongoose');
const { dbURL } = require('./config');

/**
 * Opciones de conexión optimizadas para MongoDB Atlas
 * Estas opciones aseguran una conexión estable en entornos de producción
 */
const connectionOptions = {
    // Tiempo máximo de espera para conexión inicial (30 segundos)
    serverSelectionTimeoutMS: 30000,
    // Tiempo máximo de espera para operaciones de socket (45 segundos)
    socketTimeoutMS: 45000,
    // Mantener la conexión activa
    family: 4, // Usar IPv4, evita problemas con IPv6 en algunos entornos
};

/**
 * Conecta a la base de datos MongoDB usando variables de entorno
 * Soporta tanto conexiones locales como MongoDB Atlas
 */
const connectToDatabase = async () => {
    try {
        // Validar que existe una URI de conexión
        if (!dbURL) {
            throw new Error('MONGODB_URI no está definida en las variables de entorno');
        }

        // Determinar el tipo de conexión para logging
        const isAtlas = dbURL.includes('mongodb+srv') || dbURL.includes('mongodb.net');
        const connectionType = isAtlas ? 'MongoDB Atlas' : 'MongoDB Local';

        console.log(`Conectando a ${connectionType}...`);

        await mongoose.connect(dbURL, connectionOptions);

        console.log(`✅ Conexión exitosa a ${connectionType}`);

        // Manejo de eventos de conexión
        mongoose.connection.on('error', (err) => {
            console.error('❌ Error de conexión MongoDB:', err.message);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️ Desconectado de MongoDB. Intentando reconectar...');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('🔄 Reconectado a MongoDB exitosamente');
        });

    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);

        // Proporcionar ayuda adicional si es un error de Atlas
        if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
            console.error('💡 Sugerencia: Verifica que la IP esté en la lista blanca de MongoDB Atlas');
        }
        if (error.message.includes('Authentication failed')) {
            console.error('💡 Sugerencia: Verifica las credenciales en MONGODB_URI');
        }

        process.exit(1);
    }
};

/**
 * Cierra la conexión a la base de datos de manera limpia
 * Útil para pruebas y cierre graceful del servidor
 */
const disconnectFromDatabase = async () => {
    try {
        await mongoose.connection.close();
        console.log('🔌 Desconectado de MongoDB correctamente');
    } catch (error) {
        console.error('Error al desconectar de MongoDB:', error.message);
    }
};

module.exports = {
    connectToDatabase,
    disconnectFromDatabase,
};

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }],
    totalPrice: { type: Number, required: true },
    transactionDate: { type: Date, default: Date.now },
}, { timestamps: true });

// Índices secundarios para optimización de agregaciones del Dashboard
transactionSchema.index({ totalPrice: 1 }); // Para operaciones $sum en aggregations
transactionSchema.index({ createdAt: -1 }); // Para ordenamiento de transacciones recientes
transactionSchema.index({ user: 1, createdAt: -1 }); // Índice compuesto para filtros por usuario

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    sku: { type: String, required: true, unique: true },
    quantity: { type: Number, default: 0 },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
});

// Índices secundarios para optimizar búsquedas en catálogos extensos
productSchema.index({ name: 1 }); // Índice para búsqueda por nombre
productSchema.index({ description: 'text' }); // Índice de texto para búsqueda full-text en descripción
productSchema.index({ quantity: 1 }); // Índice para filtrado por cantidad/stock
productSchema.index({ price: 1 }); // Índice para ordenamiento y rangos de precio
productSchema.index({ category: 1 }); // Índice para filtrado por categoría
productSchema.index({ category: 1, price: 1 }); // Índice compuesto para consultas combinadas
productSchema.index({ name: 1, category: 1 }); // Índice compuesto para búsquedas por nombre y categoría

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
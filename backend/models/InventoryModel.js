const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, unique: true },
    quantityInStock: { type: Number, default: 0 },
    lastRestockedDate: { type: Date, default: Date.now },
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;

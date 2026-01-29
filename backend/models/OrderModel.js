const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }],
    totalPrice: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;

/* Status can be added in future versions
to better track the order status
for now skipping this, in order not to make it much complicated */
// status: { type: String, enum: ['Pending', 'Shipped', 'Delivered'], default: 'Pending' },
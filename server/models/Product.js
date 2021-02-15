const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: false },
    available: { type: Boolean, required: true },
    category: { type: mongoose.Types.ObjectId, ref: 'Category', required: true },
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    img: { type: String, default: '' },
});

module.exports = mongoose.model('Product', productSchema);

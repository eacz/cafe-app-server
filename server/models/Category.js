const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    description: { type: String, unique: true, required: [true, 'The description is required'] },
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Category', CategorySchema);

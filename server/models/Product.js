const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    dosage: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    image: { type: String }, // URL or path
    rating: { type: Number, default: 4.5 },
    reviews: { type: Number, default: 0 },
    description: { type: String },
    bgColor: { type: String }, // For the UI card style (e.g., 'bg-emerald-800')
    textColor: { type: String }, // For UI text color if needed
    inStock: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

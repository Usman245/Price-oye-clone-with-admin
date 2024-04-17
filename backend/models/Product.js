// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    featured: String,
    brand: String,
    stock: Number,
    discription: String,
    imgurl1: String
});
productSchema.index({ name: 'text' });

module.exports = mongoose.model('Product', productSchema);

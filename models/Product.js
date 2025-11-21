const mongooseProduct = require('mongoose')
const productSchema = new mongooseProduct.Schema(
{
name: { type: String, required: true },
description: { type: String, required: true },
brand: { type: String },
category: { type: String, required: true },
images: [{ type: String }],
price: { type: Number, required: true },
stock: { type: Number, required: true },
rating: { type: Number, default: 0 }
},
{ timestamps: true }
)
module.exports = mongooseProduct.model('Product', productSchema)
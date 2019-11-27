'use strict'
const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, //
  name: { type: String, required: true },
  price: { type: Number, required: true },
  productImage: { type: String, required: true }
})

const productDbModel = mongoose.model('Product', productSchema)

module.exports = productDbModel
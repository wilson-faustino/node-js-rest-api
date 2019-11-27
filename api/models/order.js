'use strict'
const mongoose = require('mongoose')

const orderShema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // makes a relation with the Product Model
    required: true
  },
  quantity: { type: Number, default: 1 }
})

module.exports = mongoose.model('Order', orderShema)
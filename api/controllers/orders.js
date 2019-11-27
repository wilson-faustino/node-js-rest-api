'use strict'

const mongoose = require('mongoose')
// *** uppercase by convention
const Order = require('../models/order')
const Product = require('../models/product')


exports.orders_get_all = (req, res, next) => {

  Order
    .find()
    .select('product quantity _id')
    .exec()
    .then(docs => {
      res
        .status(200)
        .json({
          count: docs.length,
          orders: docs.map(doc => {
            console.log(doc)
            return {
              _id: doc._id,
              product: doc.product,
              quantity: doc.quantity,
              request: {
                type: 'GET',
                url: `http://localhost/3000/${doc._id}`
              }
            }
          }),

        })
    })
    .catch(err => res.status(500).json(err))


}

exports.orders_create_order = (req, res, next) => {

  const quantity = req.body.quantity
  const product = req.body.productId

  Product // testing if the product exists. It sould not be possible to post an order on a product that does not exist
    .findById(req.body.productId)
    .then(product => {

    })
    .catch(err => res.status(500).json({ msg: 'Produt does not exist', err }))

  const order = new Order({
    _id: mongoose.Types.ObjectId(),
    quantity,
    product
  })

  order
    .save()
    .then(result => {
      console.log(result)
      res
        .status(201)
        .json({
          message: 'Order stored',
          createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity
          },
          request: {
            type: 'GET',
            url: `http://localhost/3000/${result._id}`
          }
        })
    })
    .catch(err => {
      console.log(err)
      res
        .status(500)
        .json({ error: err })
    })

}

exports.order_get_order = (req, res, next) => {
  const id = req.params.orderId

  Order
    .findById(id)
    .exec()
    .then(order => {
      res
        .status(200)
        .json({
          success: true,
          order,
          id,
          msg: `GET requests from /orders/${id}`
        })
    })
    .catch(err => res.status(500).json(err))


}

exports.orders_delete_order = (req, res, next) => {
  const id = req.params.orderId
  Order
    .deleteOne({ id })
    .exec()
    .then(order => {
      res
        .status(200)
        .json({
          success: true,
          id,
          msg: `DELETE requests from /orders/${id}`
        })
    })
    .catch(err => {
      console.log(err)
      res
        .status(500)
        .json({ error: err })
    })

}
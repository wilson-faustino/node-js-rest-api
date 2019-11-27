'use strict'

const mongoose = require('mongoose')
// *** uppercase by convention
const Order = require('../models/order')
const Product = require('../models/product')

exports.products_get_all = (req, res, next) => {
  Product
    .find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            _id: doc._id,
            request: { type: 'GET', url: 'http://localhost/3000/' + doc._id }
          }

        })
      }
      res.status(200).json(response)
    })
    .catch(err => {
      console.log(err)
      res.status(404).json(err)
    })
}

exports.products_create_products = (req, res, next) => {

  console.log(req.file)

  const newProduct = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  })

  newProduct
    .save()
    .then(result => {
      console.log(result)
      res
        .status(201)
        .json({
          success: true,
          msg: `POST requests from /products`,
          newProduct: {
            name: result.name,
            price: result.price,
            _id: result._id,
            request: { type: 'GET', url: 'http://localhost/3000/' + newProduct._id }
          }
        })
    })
    .catch(err => {
      console.log(err)
      res
        .status(500)
        .json({
          success: false,
          error: err
        })
    })


}

exports.products_get_product = (req, res, next) => {

  const id = req.params.productId

  Product
    .findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
      doc._id
        ? res.status(200).json({
          product: doc,
          request: { type: 'GET', url: `http://localhost/3000/${doc._id}` }
        })
        : res.status(404).json({ success: false, msg: 'ID Not Found' })
    })
    .catch(err => {
      console.log(err)
      res
        .status(500)
        .json({ err })
    })
}

exports.products_update_product = (req, res, next) => {
  const id = req.params.productId

  const updateOps = {}
  for (const ops of req.body) {
    console.log('ops', ops)
    updateOps[ops.propName] = ops.value
  }

  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'GET',
          url: 'http://localhost/3000/products/' + id
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })
}

exports.products_delete_product = (req, res, next) => {
  const id = req.params.productId

  Product
    .remove({ _id: id })
    .exec()
    .then(result => res
      .status(200)
      .json({
        message: 'Product deleted',
        url: 'http://localhost/products',
        body: { name: 'String', price: 'Number' }
      }))
    .catch(err => {
      res.status(500).json(err)
    })
}
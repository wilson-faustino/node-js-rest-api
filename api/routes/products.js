'use strict'
const router = require('express').Router()
// *************************
const checkAuth = require('../middleware/check-auth')
// ****** DATABASE *** importing Product Model (Mongoose Schema)
const mongoose = require('mongoose')
// *** uppercase by convention
const Product = require('../models/product')

const ProductsController = require('../controllers/products')

// ****** UPLOAD IMAGE
const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter
})

// ****** ROUTES
// ****** GET
router.get('/', ProductsController.products_get_all)

router.get('/:productId', ProductsController.products_get_product)

// ****** POST
router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_products)

// ****** PATCH
router.patch('/:productId', checkAuth, ProductsController.products_update_product)

// ****** DELETE
router.delete('/:productId', checkAuth, ProductsController.products_delete_product)

module.exports = router
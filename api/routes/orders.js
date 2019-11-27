'use strict'
const router = require('express').Router()
const checkAuth = require('../middleware/check-auth')
// *************************

// ****** DATABASE *** importing Product Model (Mongoose Schema)


// *************************
const OrdersController = require('../controllers/orders')
// ****** GET
router.get('/', checkAuth, OrdersController.orders_get_all)

router.get('/:orderId', checkAuth, OrdersController.order_get_order)

// ****** POST
router.post('/', checkAuth, OrdersController.orders_create_order)

// ****** PATCH
// no patch requests from /orders

// ****** DELETE
router.delete('/:orderId', checkAuth, OrdersController.orders_delete_order)

module.exports = router
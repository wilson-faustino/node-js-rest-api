'use strict'
const path = require('path')
const morgan = require('morgan')
const express = require('express')
const app = express()
const mongoose = require('mongoose')

// ENVIROMENT VARIABLES
const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(__dirname, 'config/config.env') })

// *** MONGOOSE
const mongoUri = process.env.MONGO_URI
// https://github.com/Automattic/mongoose#connecting-to-mongodb
mongoose.connect(mongoUri, {
  // https://mongoosejs.com/docs/deprecations.html
  useNewUrlParser: true,
  useUnifiedTopology: true
})

mongoose.Promise = global.Promise //default Node JS Promise

// ****** MIDDLEWARES STACK

// *** LOGS HTTP REQUESTS ***
app.use(morgan('dev'))
// **************

app.use('/uploads', express.static('uploads')) //make uploads folder available. Coude have made o route /uploads

// *** BODY PARSER ***
// obs. express ^4.16 has a built in body parser
// https://expressjs.com/en/4x/api.html#express.urlencoded
// https://github.com/expressjs/express/releases/tag/4.16.0
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
// **************

// *** HANDLING CORS ***
app.use((req, res, next) => {

  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization')

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    console.log('oi')
    return res.status(200).json({})
  }
  next()
})
// **************

// *** ROUTES ***

// /products
const productsRoutes = require('./api/routes/products')
app.use('/products', productsRoutes)

// /orders
const ordersRoutes = require('./api/routes/orders')
app.use('/orders', ordersRoutes)
// **************

// /user/signup
// /user/login
const userRoutes = require('./api/routes/user')
app.use('/user', userRoutes)


// *** ERROR HANDLING ***
// 404
app.use((req, res, next) => {
  // any request that reaches here were not handled above,
  // which means its an error
  const error = new Error('Not found')
  // creates a new Error object
  error.status = 404
  // creates a new property 404 on that Error object
  next(error)
  // forwards the Error object along with that 404 property
  // ***
  // recap: a request was not to /products nor to /orders, so
  // the next method fowards an Error object along with a 404 property
})
// 500
app.use((err, req, res, next) => {
  //err parameter receives the error object as an argument
  res
    .status(err.status || 500) //.status was created (or not) at the previous app.use()
    .json({
      error: {
        msg: err.message // .message comes as default of Error object. Error("I'm the message")
      }
    })
})

module.exports = app
'use strict'
const router = require('express').Router()
// *************************

// ****** ENVIROMENT VARIABLES *** importing JWT_KEY
const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(__dirname, '../../', 'config/config.env') })

// ****** BCRYPT *** importing hashing module
const bcrypt = require('bcrypt')
/*
https://codahale.com/how-to-safely-store-a-password/
https://hackernoon.com/your-node-js-authentication-tutorial-is-wrong-f1a3bf831a46
*/

// ****** JSON WEB TOKEN ***
const jwt = require('jsonwebtoken')
// *** importing JWT_KEY
const JWT_KEY = process.env.JWT_KEY

// ****** DATABASE *** importing User Model (Mongoose Schema)
const mongoose = require('mongoose')
// *** uppercase by convention
const User = require('../models/user')

const userController = require('../controllers/user')

// ****** ROUTES

// ****** POST - /signup
router.post('/signup', userController.user_signup)

// ****** POST - /login
router.post('/login', userController.user_login)

// ****** DELETE
router.delete('/:userId', userController.user_delete)

module.exports = router
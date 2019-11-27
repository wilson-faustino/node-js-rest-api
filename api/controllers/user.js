'use strict'

const mongoose = require('mongoose')
// *** uppercase by convention
const Order = require('../models/order')
const User = require('../models/user')

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

exports.user_signup = (req, res, next) => {

  // verificar se já existe esse e-mail no Banco de Dados
  User
    .find({ email: req.body.email })
    .exec()
    .then(user => {

      if (user.length >= 1) { return res.status(409).json({ msg: 'Email já existe' }) } //409 erro de conflito

      else {

        bcrypt.hash(req.body.password, 10, (err, hash) => {

          if (err) { return res.status(500).json({ error: err }) }

          else {

            const newUser = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            })

            newUser
              .save()
              .then(result => {

                console.log(result);

                res.status(201).json({
                  msg: 'User created'
                })
              })
              .catch(err => {
                res.status(500).json({
                  error: err, aqui: 'aqui'
                })
              })
          }
        })

      }
    })
}

exports.user_login = (req, res, next) => {

  User
    .find({ email: req.body.email })
    .exec()
    .then(user => {

      console.log(user)

      if (user.length < 1) {
        return res.status(401).json({ // 401 unauthorized
          msg: 'Auth failed'
        })
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            msg: 'Auth failed'
          })
        }
        if (result) {
          // usuário está logado
          // jwt determina as autorizações
          const token = jwt.sign({
            email: user[0].email,
            userId: user[0]._id
          },
            JWT_KEY,
            {
              expiresIn: "1h"
            })
          return res.status(200).json({
            msg: 'Auth successful',
            token: token
          })
        }
        res.status(401).json({
          msg: 'Auth failed'
        })
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: err })
    })

}


exports.user_delete = (req, res, next) => {

  const id = req.params.userId

  User
    .deleteOne({ _id: id }) // .remove() is deprecated
    .exec()
    .then(result => {
      res.status(200).json({ msg: 'User deleted' })
    })
    .catch(err => {
      res.status(500).json({ error: err, aqui: 'cheguei aqui' })
    })

}
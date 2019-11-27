const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {

  try {
    const token = req.headers.authorization.split(' ')[1] // retira o "Bearer " do token
    console.log(token)
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.userData = decoded
    next() // only if authenticated

  } catch (error) {
    return res.status(401).json({
      msg: 'Auth failed'
    })
  }

}
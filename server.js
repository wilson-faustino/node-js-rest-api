'use strict'
// ****** IMPORTING MODULES

const http = require('http')
const app = require('./app') // express.js
// *** this app module comes along with dotenv (process.env.VAR)

// ****** SETTING UP HTTP SERVER

const PORT = process.env.PORT || 4000
const server = http.createServer(app)
// https://expressjs.com/en/api.html#app.listen
/*
The app returned by express() is in fact a JavaScript Function,
designed to be passed to Node’s HTTP servers as a callback to handle requests.
This makes it easy to provide both HTTP and HTTPS versions of your app
with the same code base, as the app does not inherit from these (it is simply a callback):
*/

server.listen(PORT, (req, res) => console.log(`Server running on PORT ${PORT}`))
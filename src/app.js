const express = require('express')
const cors = require('cors')

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise', p, 'reason:', reason.stack)
  // application specific logging, throwing an error, or other logic here
})

const app = express()

const errorMiddleware = (err, req, res, next) => {
  // TODO Add logging of non-validation errors
  if (err) res.json(err.message)
}

app.use(cors())
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})
require(process.env.srcRoot + '/controllers')(app)
app.use(errorMiddleware)

module.exports = app

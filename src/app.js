const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason.stack)
  // application specific logging, throwing an error, or other logic here
})

const app = express()

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'))
}

// Allows use to catch exceptions inside promises when used in express controllers
// see https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/
global.wrap = fn => (...args) => {
  const functionReturnVal = fn(...args)

  const isPromise = typeof functionReturnVal.catch !== 'undefined'
  if (isPromise) {
    functionReturnVal.catch(args[2])
  }
}

const errorMiddleware = (err, req, res, next) => {
  console.error(err)
  res.header('Access-Control-Allow-Origin', '*')
  res.status(500).send('Server error')
  next()
}

app.use(cors())
require('./controllers')(app)
app.use(errorMiddleware)

module.exports = app

const express = require('express')
const router = express.Router()

router.get('/', async function (req, res) {
  res.end('alive')
}) // TODO Setup global error handling with a wrapper function

module.exports = router

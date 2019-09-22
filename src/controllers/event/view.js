const express = require('express')
const router = express.Router()

const { Event } = require(process.env.srcRoot + '/db')

router.get('/', function (req, res, next) {
  res.status(400)
  next(new Error('Missing ID parameter'))
})

router.get('/:id', function (req, res, next) {
  // Get event by ID
  const id = req.params.id

  Event.findOne({ id: id.toString() }).then(event => {
    if (!event) {
      res.status(404)
      next(new Error('Invalid ID'))
    } else {
      res.json(event)
    }
  })
}) // TODO Setup global error handling with a wrapper function

// The super secret corner
const validate = (body) => {
  if (!body.name || !body.date || !body.description) return false
  if (isNaN(Date.parse(body.date))) return false
}

router.post('/', async (req, res, next) => {
  if (req.headers.prettyplease === false) {
    res.status(403)
    next(new Error("You didn't say the magic word")) // TODO actually auth for this
  }

  if (!validate(req.body)) {
    res.status(400)
    next(new Error('Your request body sucks'))
  }

  await Event.create({ name: req.body.name, date: req.body.date, description: req.body.description })
  res.status(200)
  res.end('ok')
})

module.exports = router

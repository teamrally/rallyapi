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
  }).catch(/* istanbul ignore next */ err => {
    res.status(500)
    next(new Error(err))
  })
})

module.exports = router

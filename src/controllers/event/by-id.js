const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const { Event } = require(process.env.srcRoot + '/db')

router.get('/', function (req, res, next) {
  res.status(400)
  next(new Error('Missing ID parameter'))
})

router.get('/:id', function (req, res, next) {
  // Get event by ID
  const id = req.params.id

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400)
    next(new Error('Invalid ID format'))
  } else {
    Event.findOne({ _id: id.toString() }).then(event => {
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
  }
})

module.exports = router

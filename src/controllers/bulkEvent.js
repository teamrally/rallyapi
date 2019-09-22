const express = require('express')
const router = express.Router()

const { Event } = require(process.env.srcRoot + '/db')

router.get('', function (req, res, next) {
  // Get event by ID
  const startDate = new Date(req.headers.startdate)
  const endDate = new Date(req.headers.enddate)

  if (!startDate || !endDate) {
    res.status(400)
    next(new Error('Missing parameters'))
  }

  Event.find({ date: { $gte: startDate.toISOString(), $lte: endDate.toISOString() } }).then((data) => {
    res.json(data)
    next()
  }).catch(err => {
    res.status(500)
    next(new Error(err))
  })
})

module.exports = router

const express = require('express')
const router = express.Router()

// todo: delete this file immediately and replace with something that works
router.get('/', (req, res) => {
  const dummy = {
    id: 69,
    headline: "expose the president's search history",
    dateTime: '23-12-2019 17:30',
    location: 'yes',
    desc: 'the president searched the forbidden numbers; he must be brought to justice. #justiceforsaki'
  }

  res.json(dummy)
})

module.exports = router

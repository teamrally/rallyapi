const mongoose = require('mongoose')

const s = {
  name: 'Event',
  schema: new mongoose.Schema({
    id: String,
    name: String,
    date: Date,
    description: String
  })
}

module.exports = mongoose.model(s.name, s.schema)

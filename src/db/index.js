const { readdirSync } = require('fs')

const names = readdirSync('./db/schemas')
const models = {}

names.forEach(n => {
  const model = require('./schemas/' + n)
  models[model.modelName] = model

  console.log(`Loaded ${model.modelName} schema.`)
})

module.exports = models

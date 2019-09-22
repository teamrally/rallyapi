const { readdirSync } = require('fs')

const names = readdirSync(process.env.srcRoot + '/db/schemas/')
const models = {}

names.forEach(n => {
  const model = require(process.env.srcRoot + '/db/schemas/' + n)
  models[model.modelName] = model

  console.log(`Loaded ${model.modelName} schema.`)
})

module.exports = models

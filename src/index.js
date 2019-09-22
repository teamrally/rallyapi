const path = require('path')
process.env.srcRoot = path.resolve(__dirname)

const app = require('./app')
const dotenv = require('dotenv')

if (process.env.NODE_ENV === 'test') dotenv.config({ path: process.env.srcRoot + '/env/test.env' })
else dotenv.config({ path: process.env.srcRoot + '/env/.env' })

const mongoose = require('mongoose')

const setupDatabase = () => {
  const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
  const dbName = 'data_' + env + '_rallyapi'

  if (env === 'development') {
    mongoose.set('debug', true)
  }

  return mongoose.connect(`mongodb://${process.env.MONGO}:27017/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true })
}

setupDatabase().catch((err) => {
  console.error('Database error encountered:\n' + err.message + '. Shutting down...')
  process.exit(1)
})

app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`))

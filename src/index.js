const path = require('path')
process.env.srcRoot = path.resolve(__dirname)

const app = require('./app')
const dotenv = require('dotenv')

if (process.env.NODE_ENV === 'test') dotenv.config({ path: process.env.srcRoot + '/env/test.env' })
else dotenv.config({ path: process.env.srcRoot + '/env/.env' })

app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`))

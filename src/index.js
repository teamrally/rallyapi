const app = require('./app')
const dotenv = require('dotenv')
dotenv.config({ path: './env/.env' })

app.listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`))

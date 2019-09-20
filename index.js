const express = require('express')
const app = express()
const port = 3000

// endpoints be like
const alive = require('./root/alive')

app.get("/", (req, res) => (res.send("why are you here")))
app.get("/alive", alive)

app.listen(port, () => console.log(`listening on ${port}`))
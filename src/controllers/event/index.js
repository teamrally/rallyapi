const fs = require('fs')

module.exports = function (r) {
  const f = fs.readdirSync(process.env.srcRoot + '/controllers/event')
  f.forEach((f) => {
    /* istanbul ignore if */
    if (fs.lstatSync(`${process.env.srcRoot}/controllers/event/${f}`).isDirectory()) {
      require(`./${f}`)(r)
      return
    }

    if (f === 'index.js') return
    try {
      r.use(`/event/${f.split('.')[0]}/`, require(`./${f}`))
      console.log(`Added event/${f} to routes.`)
    } catch (e) {
      /* istanbul ignore next */
      console.error(`Error loading ${f}:  ${e.stack}`)
    }
  })
}

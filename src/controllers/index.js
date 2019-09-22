const fs = require('fs')

module.exports = function (r) {
  const f = fs.readdirSync(process.env.srcRoot + '/controllers')
  f.forEach((f) => {
    if (fs.lstatSync(`${process.env.srcRoot}/controllers/${f}`).isDirectory()) {
      require(`./${f}`)(r)
      return
    }

    if (f === 'index.js') return
    try {
      r.use(`/${f.split('.')[0]}/`, require(`./${f}`))
      console.log(`Added ${f} to routes.`)
    } catch (e) {
      /* istanbul ignore next */
      console.error(`Error loading ${f}:  ${e.stack}`)
    }
  })
}

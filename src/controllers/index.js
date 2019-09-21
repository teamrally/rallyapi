module.exports = function (r) {
  const f = require('fs').readdirSync(process.env.srcRoot + '/controllers')
  f.forEach((f) => {
    if (f === 'index.js') return
    try {
      r.use(`/${f.split('.')[0]}/`, require(`./${f}`))
      console.log(`Added ${f} to routes.`)
    } catch (e) {
      console.error(`Error loading ${f}:  ${e.stack}`)
    }
  })
}

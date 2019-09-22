const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiHttp)
chai.use(chaiAsPromised)

process.env.srcRoot = require('path').resolve('./src')
process.env.NODE_ENV = 'test'

const mongoose = require('mongoose')

const setupDatabase = () => {
  const dbName = 'data_test'

  // mongoose.set('debug', true);

  return mongoose.connect(`mongodb://localhost:27017/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true })
}

setupDatabase()

const app = require('../src/app')

const requester = chai.request(app).keepOpen()

describe('General health', function () {
  it('Should return alive state', function (done) {
    requester.get('/alive')
      .end(function (err, res) {
        expect(err).to.be.a('null')
        expect(res.text).to.equal('alive')
        done()
      })
  })
})

describe('Event route', function () {
  it('Should return 403 error without an ID', function (done) {
    requester.get('/event')
      .end(function (err, res) {
        expect(err).to.equal(null)
        expect(res.status).to.equal(400)
        expect(res.body).to.equal('Missing ID parameter')
        done()
      })
  })
})

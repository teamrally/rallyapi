const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const chaiAsPromised = require('chai-as-promised')
const dotenv = require('dotenv')

chai.use(chaiHttp)
chai.use(chaiAsPromised)

process.env.srcRoot = require('path').resolve('./src')
dotenv.config({ path: process.env.srcRoot + '/env/test.env' })
process.env.NODE_ENV = 'test'

const mongoose = require('mongoose')
const models = require(process.env.srcRoot + '/db')

const setupDatabase = () => {
  const dbName = 'data_test'

  // mongoose.set('debug', true);

  return mongoose.connect(`mongodb://${process.env.MONGO}:27017/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true })
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
  before(function (done) {
    const event = new models.Event({ id: '1', name: 'testevent', date: new Date(), description: 'testeventdesc' })
    event.save(function (err) {
      if (err) console.error(err)
      done()
    })
  })
  after(async function () {
    mongoose.connection.dropCollection('events')
  })

  it('Should return 403 error without an ID', function (done) {
    requester.get('/event')
      .end(function (err, res) {
        expect(err).to.equal(null)
        expect(res.status).to.equal(400)
        expect(res.body).to.equal('Missing ID parameter')
        done()
      })
  })

  it('Should return 404 error with an invalid ID', function (done) {
    requester.get('/event/2')
      .end(function (err, res) {
        expect(err).to.equal(null)
        expect(res.status).to.equal(404)
        expect(res.body).to.equal('Invalid ID')
        done()
      })
  })

  it('Should return the correct event', function (done) {
    requester.get('/event/1')
      .end(function (err, res) {
        expect(err).to.equal(null)
        expect(res.status).to.equal(200)
        expect(res.body.id).to.equal('1')
        done()
      })
  })
})

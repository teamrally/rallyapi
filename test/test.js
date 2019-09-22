const chai = require('chai')
const expect = chai.expect
const chaiHttp = require('chai-http')
const chaiAsPromised = require('chai-as-promised')
const sinon = require('sinon')

chai.use(chaiHttp)
chai.use(chaiAsPromised)

process.env.srcRoot = require('path').resolve('./src')

const dotenv = require('dotenv')
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

async function createRandomEvents (amount, dateStart, dateEnd) {
  const start = new Date('01-01-2003')
  const end = new Date('01-01-2004')

  await models.Event.create({ name: Math.random().toString(), date: randomDate(start, end), description: Math.random().toString() })
  await models.Event.create({ name: Math.random().toString(), date: randomDate(start, end), description: Math.random().toString() })
  await models.Event.create({ name: Math.random().toString(), date: randomDate(start, end), description: Math.random().toString() })
}

function randomDate (start, end) {
  var date = new Date(+start + Math.random() * (end - start))
  return date
}

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
  let data

  before(function (done) {
    const event = new models.Event({ _id: '53cb6b9b4f4ddef1ad47f943', name: 'testevent', date: new Date(), description: 'testeventdesc' })
    event.save(function (err, dataN) {
      if (err) console.error(err)

      data = dataN
      done()
    })
  })
  after(async function () {
    mongoose.connection.dropCollection('events')
  })

  it('Should return 403 error without an ID', function (done) {
    requester.get('/event/by-id')
      .end(function (err, res) {
        expect(err).to.equal(null)
        expect(res.status).to.equal(400)
        expect(res.body).to.equal('Missing ID parameter')
        done()
      })
  })

  it('Should return 404 error with an invalid ID format', function (done) {
    requester.get('/event/by-id/' + 'nigerundayo')
      .end(function (err, res) {
        expect(err).to.equal(null)
        expect(res.status).to.equal(400)
        expect(res.body).to.equal('Invalid ID format')
        done()
      })
  })

  it('Should return 404 error with an invalid ID', function (done) {
    requester.get('/event/by-id/' + '53cb6b9b4f4ddef1ad47f944')
      .end(function (err, res) {
        expect(err).to.equal(null)
        expect(res.status).to.equal(404)
        expect(res.body).to.equal('Invalid ID')
        done()
      })
  })

  it('Should return the correct event', function (done) {
    requester.get('/event/by-id/' + data._id.toString())
      .end(function (err, res) {
        expect(err).to.equal(null)
        expect(res.status).to.equal(200)
        expect(res.body._id).to.equal(data._id.toString())
        done()
      })
  })
})

describe('Bulkevent route', function () {
  before(function (done) {
    createRandomEvents().then(done).catch(console.error)
  })

  after(async function () {
    mongoose.connection.dropCollection('events')
  })

  it('Should validate the date inputs', function (done) {
    requester.get('/event/search')
      .set('startDate', 'yareyaredaze')
      .set('endDate', '01-01-2002')
      .end(function (err, res) {
        expect(err).to.equal(null)
        expect(res.status).to.equal(400)
        expect(res.body).to.equal('Missing parameters')
        done()
      })
  })

  it('Should return the correct events', function (done) {
    requester.get('/event/search')
      .set('startDate', '01-02-2003')
      .set('endDate', '01-01-2004')
      .end(function (err, res) {
        expect(err).to.equal(null)
        expect(res.status).to.equal(200)
        expect(res.body.length).to.equal(3)
        done()
      })
  })
})

describe('Promise error handling', function (done) {
  before(async function () {
    this.stub = sinon.stub(console, 'error')
    this.promise = new Promise((resolve, reject) => { reject(new Error('test')) }) // RACE CONDITION
  })

  after(function () {
    this.stub.restore()
  })

  it('should catch a thrown Promise error', async function () {
    expect(this.stub.called).to.equal(true)
  })
})

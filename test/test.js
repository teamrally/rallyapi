const chai = require('chai')
const assert = chai.assert
const expect = chai.expect
const chaiHttp = require('chai-http')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiHttp)
chai.use(chaiAsPromised)

process.env.srcRoot = require('path').resolve('./src')
process.env.NODE_ENV = 'test'

const app = require('../src/app')

const requester = chai.request(app).keepOpen()

describe('General test', function () {
  it('should pass 2+2', function () {
    const num = 2 + 2

    assert.equal(num, 4)
  })
})

describe('Routes', function () {
  it('Should return alive state', function (done) {
    requester.get('/alive')
      .end(function (err, res) {
        expect(err).to.be.a('null')
        expect(res.text).to.equal('alive')
        done()
      })
  })
})

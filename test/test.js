const chai = require('chai')
const assert = chai.assert

describe('General test', function () {
  it('should pass 2+2', function () {
    const num = 2 + 2

    assert.equal(num, 4)
  })
})

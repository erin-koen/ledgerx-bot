const db = require('../../Data/dbConfig.js')
const Exchanges = require('./ExchangeModel.js')

describe('the exchange model', () => {
  describe('the add method', () => {
    beforeEach(async () => {
      await db('exchanges').truncate()
    });
    it('should add an exchange and return a string', () => {

    });
  })
})

const db = require('../../Data/dbConfig.js')
const Daily = require('./DailyRecordModel.js')

describe('the daily record model', () => {

  describe('the add method', async () => {
    beforeEach(async () => {
      await db('daily_records').truncate()
    })
    it('should insert all contracts when passed as an array', () => {

    })
    it('should throw an error if a contract is missing a non-nullable field.', () => {
        
    })
  })

  describe('the max volume by date method', async () => {
    beforeEach(async () => {
      await db('daily_records').truncate()
    })
    // that it returns the correct contract is implicit in each of the following
    it('should return an array of one contract object with volume if there is only one highest volume contract', () => {

    })
    it('should return an array of more than one contract object with volume if there are multiple contracts with the same volume and it is the highest', () => {

    })
  })

  describe('the sum of volumes by date method', async () => {
    beforeEach(async () => {
      await db('daily_records').truncate()
    })
    it('should return an integer == the sum of all volumes if trades are found', () => {
        
    });
    it('should return a string if no trades are found', () => {
        
    });
  })
})

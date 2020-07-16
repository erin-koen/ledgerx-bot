const db = require('../../Data/dbConfig.js')
const Contracts = require('./ContractModel.js')
const foromat = require('date-fns')

// const testContract1 = {
//   trade_date: format(new Date(), 'yyyy-MM-dd'),
//   expiry_date: format(new Date('2021-11-11'), 'yyyy-MM-dd'),
//   contract_type: 'options_contract',
//   option_type: 'call',
//   option_strike: 150000,
//   contract_ccy: 'BTC',
//   volume: 150,
//   open_interest: 10000,
//   vwap: 975,
//   last_bid: 950,
//   last_ask: 1000
// }

// const testContract2 = {
//   trade_date: format(new Date(), 'yyyy-MM-dd'),
//   expiry_date: format(new Date('2021-11-11'), 'yyyy-MM-dd'),
//   contract_type: 'options_contract',
//   option_type: 'call',
//   option_strike: 200000,
//   contract_ccy: 'BTC',
//   volume: 100,
//   open_interest: 10100,
//   vwap: 985,
//   last_bid: 960,
//   last_ask: 1100
// }

// const testContracts = [testContract1, testContract2]

describe('the contract model', () => {
  describe('the add method', async () => {
    beforeEach(async () => {
      await db('contracts').truncate()
    })
    it('should insert all contracts when passed an array', async () => {
      const length = testContracts.length
      await Contracts.addContracts(testContracts)
      const contracts = await db('contracts')
      expect(contracts).toHaveLength(length)
    })
  })

  describe('the find contracts by expiry date range method', async () => {
    beforeEach(async () => {
      await db('contracts').truncate()
    })
    it('it should return an array of objects in the correct date range', async () => {
      // await Contracts.addContracts(testContracts)
      // const trade_date = format(new Date(), 'yyyy-MM-dd')
      // const greatest = await Contracts.findGreatestByDate('options_contract', trade_date)
      // expect(greatest).toHaveLength(1)
    })
    it('it should return an array of the correct length', async () => {})
    it('should return a string if no contracts are expirying in the date range', async () => {
      // await Contracts.addContracts(testContracts)
      // await Contracts.addContracts(testContract1)
      // const trade_date = format(new Date(), 'yyyy-MM-dd')
      // const greatest = await Contracts.findGreatestByDate('options_contract', trade_date)
      // expect(greatest).toHaveLength(2)
    })
  })
})

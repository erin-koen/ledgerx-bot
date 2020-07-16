const db = require('../../Data/dbConfig.js')

module.exports = {
  add,
  getMaxByDate,
  getDailyTotal,
  getPremByContract
}

async function add (trades) {
  // expects an array of record objects
  const newRecords = await db('daily_records').insert(trades)

  return `${newRecords.rowCount} records were added to the database.`
}

async function getMaxByDate (tradeDate) {

  const {max} = await db('daily_records')
    .max('volume')
    .where({ trade_date: tradeDate }).first()

  const {contract_id} = await db('daily_records').where({
    volume: max,
    trade_date: tradeDate
  }).first()

  const contract = await db('contracts')
    .where({ id: contract_id })
    .first()

  const return_object = {
    trade_date: tradeDate,
    expiry: contract.expiry_date,
    strike: contract.option_strike,
    optionType: contract.option_type,
    volume: max
  }

  return return_object
}

async function getDailyTotal (date) {
  const {sum} = await db('daily_records').sum('volume').where({trade_date: date}).first()

  return sum
}

async function getPremByContract (contract_id) {
  // query records by contract_id
  // return premium, date, ordered by date ascending
  const records = await db('daily_records')
    .select('vwap', 'date')
    .where('contract_id', contract_id)
    .orderBy('date', 'asc')

  const returnObject = {
    contractId: contract_id,
    prices: records
  }

  return returnObject
}

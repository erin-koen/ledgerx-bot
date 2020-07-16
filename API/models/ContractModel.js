const db = require('../../Data/dbConfig.js')

module.exports = {
  get,
  findBy,
  addContracts,
  findSumByDate,
  findGreatestByDate
}

function get () {
  return db('contracts')
}

async function addContracts (arr) {
  const [id] = await db('contracts')
    .insert(arr)
    .returning('id')
  return id
}

async function findGreatestByDate (contractType, tradeDate) {
  const max = await db('contracts')
    .max('volume')
    .where({ contract_type: contractType, trade_date: tradeDate })
    .first()
  console.log(max)
  if (max['max']) {
    const contractArray = await db('contracts').where({
      volume: max['max'],
      contract_type: contractType,
      trade_date: tradeDate
    })
    return contractArray
  } else {
    return 'No contracts in the database were traded on that date.'
  }
}

async function findSumByDate (contractType, date) {
  const sum = await db('contracts')
    .sum('volume')
    .where({ contract_type: contractType, trade_date: date })
    .first()
  if (sum['sum']) {
    return sum['sum']
  } else {
    return 'No contracts in the database were traded on that date.'
  }
}

async function findBy (filter) {
  const contracts = await db('contracts').where(filter)
  return contracts
}

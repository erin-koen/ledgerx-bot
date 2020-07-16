const db = require('../../Data/dbConfig.js')

module.exports = {
  addExchange
}

async function addExchange (exchange) {
  const [name] = await db('exchanges')
    .insert(exchange)
    .returning('name')
  return name
}

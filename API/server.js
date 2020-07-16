const express = require('express')
const server = express()

// import routers
const countractRouter = require('./controllers/contracts.js')
const exchangeRouter = require('./controllers/exchanges.js')
const tradeRouter = require('./controllers/dailyRecords.js')

// apply middleware
server.use(express.json())

// apply routers
server.use('/api/contracts', countractRouter)
server.use('/api/exchanges', exchangeRouter)
server.use('/api/trades', tradeRouter)

server.get('/', (req, res) => {
  res.status(200).json({ message: 'Sanity check.' })
})

module.exports = server

require('dotenv').config()
const cron = require('node-cron')
const server = require('./API/server.js')
const { contractHelper, tradeHelper } = require('./API/helpers/contractHelper.js')
const { eodTweet, dailyExpiryTweet } = require('./API/helpers/twitterHelper.js')
const { addLedgerX } = require('./API/helpers/exchangeHelper.js')

// will return an error if ledger x is already in the DB
// addLedgerX()

const contracts = cron.schedule(
  '00 17 * * *',
  () => {
    console.log('Fetching contract data from Ledger X.')
    contractHelper()
  },
  {
    scheduled: true,
    timezone: 'America/New_York'
  }
)

const trades = cron.schedule(
  '01 17 * * *',
  () => {
    console.log('Fetching trade data from Ledger X.')
    tradeHelper()
  },
  {
    scheduled: true,
    timezone: 'America/New_York'
  }
)

const dailyVolumeTweet = cron.schedule(
  '02 17 * * *',
  () => {
    console.log('Tweeting daily data.')
    eodTweet()
  },
  {
    timezone: 'America/New_York'
  }
)

// const tweetExpiries = cron.schedule(
//   '30 08 * * *',
//   () => {
//     console.log('Tweeting daily expiries.')
//     dailyExpiryTweet()
//   },
//   {
//     timezone: 'America/New_York'
//   }
// )



contracts.start()
trades.start()
dailyVolumeTweet.start()
// tweetExpiries.start()

const port = process.env.PORT || 8000

server.listen(port, () => {
  console.log(`***Server up and running on port ${port}.***`)
})

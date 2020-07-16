const axios = require('axios')
const moment = require('moment')
const Twit = require('twit')

const today = moment().format('YYYY-MM-DD')


const client = new Twit({
  consumer_key: process.env.TWITTER_APP_KEY,
  consumer_secret: process.env.TWITTER_APP_SECRET,
  access_token: process.env.OAUTH_TOKEN,
  access_token_secret: process.env.OAUTH_TOKEN_SECRET
})

// const endpoint = `http://localhost:8000/api`
const endpoint = `https://bitcoin-options-data.herokuapp.com/api`

const sumEndpoint = `${endpoint}/trades/total/${today}`

const maxEndpoint = `${endpoint}/trades/max/${today}`

const dailyExpiryEndpoint = `${endpoint}/options/expiring/${today}`

// returns the sum of contracts traded on a given day
function getSum () {
  return axios
    .get(sumEndpoint)
    .then(res => {
      return res.data
    })
    .catch(error => console.log(error))
}

getSum()

// returns the most-traded contract on a given day (doesn't handle ties yet)
function getMostTraded () {
  return axios
    .get(maxEndpoint)
    .then(res => {
      return res.data
    })
    .catch(error => console.log(error))
}

// returns the contracts that will expire today (updated as of the night before)
function getDailyExpiringOptions () {
  return axios
    .get(dailyExpiryEndpoint)
    .then(res => {
      return res.data
    })
    .catch(error => console.log(error))
}

// aggregates data and tweets daily activity.
async function eodTweet () {
  try {
    // assemble daily stats
    const sum = await getSum() // returns { total : 149 }
    if (typeof sum.total !== 'int') {
    }

    const mostActive = await getMostTraded() // returns {trade_date: YYYY-MM-DD, expiry: ISO, strike: int, optionType: string, volume: int}

    const expiryDate = moment(mostActive.expiry).format('MMM DD YYYY')

    console.log(expiryDate)

    // interpolate messages
    const mostActiveMessage = `The ${expiryDate} $${mostActive.strike} BTC ${
      mostActive.optionType
    } was the most active contract, trading ${mostActive.volume} times.`

    const message = `${
      sum.total
    } options contracts traded on @LedgerX today. ${mostActiveMessage}`

    // call twitter client to post
    client.post('statuses/update', { status: message }, function (
      error,
      tweet,
      response
    ) {
      if (!error) {
        console.log(tweet)
      } else {
        console.log(error)
      }
    })
    return
  } catch (error) {
    console.log(error)
  }
}


// aggregates daily expiries => not ready yet.
async function dailyExpiryTweet () {
  try {
    const { contracts } = await getDailyExpiringOptions()

    // contracts is currently full of dups, because one gets added every day they trade
    const contractDict = {}
    const singleContracts = []

    // this is janky, and will be solved by multiple db tables - contracts and trades
    for (let contract of contracts) {
      if (contract.contract_type == 'options_contract') {
        if (
          !contractDict[`${contract.option_strike} ${contract.option_type}`]
        ) {
          contractDict[
            `${contract.option_strike} ${contract.option_type}`
          ] = true
          singleContracts.push(contract)
        } else {
          continue
        }
      }
    }
    // handle the case where nothing's expiring
    if (singleContracts.length === 0) {
      console.log('No options are expiring today.')
      return
    }

    let contractsMessage =
      'As of yesterday afternoon, the following options are due to expire on @ledgerx today:\n'

    for (let contract of singleContracts) {
      if (contract.open_interest === 1) {
        contractsMessage =
          contractsMessage +
          `${contract.open_interest} $${contract.option_strike} ${
            contract.contract_ccy
          } ${contract.option_type}\n`
      } else {
        contractsMessage =
          contractsMessage +
          `${contract.open_interest} $${contract.option_strike} ${
            contract.contract_ccy
          } ${contract.option_type}s\n`
      }
    }
    console.log(contractsMessage)
    client.post('statuses/update', { status: contractsMessage }, function (
      error,
      tweet,
      response
    ) {
      if (!error) {
        console.log(tweet)
      } else {
        console.log(error)
      }
    })
    return
  } catch (error) {
    console.log(error)
  }
}

module.exports = { eodTweet, dailyExpiryTweet }

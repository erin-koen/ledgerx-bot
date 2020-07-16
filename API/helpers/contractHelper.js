const Contracts = require('../models/ContractModel.js')
const moment = require('moment')
const axios = require('axios')

const today = moment().format('YYYY-MM-DD')


// const host = 'http://localhost:8000/api/'
const host = 'https://bitcoin-options-data.herokuapp.com/api/'

const endpoint = `https://data.ledgerx.com/json/${today}.json`
// const endpoint = `https://data.ledgerx.com/json/2019-11-11.json`

function getContracts () {
  return axios
    .get(endpoint)
    .then(res => {
      return res.data.report_data
    })
    .catch(error => console.log(error))
}

function parseContracts (raw) {
  const return_arr = []

  for (let contract of raw) {
    if (
      contract.open_interest !== 0 &&
      contract.contract_type == 'options_contract'
    ) {
      let contractDetails = contract.contract_label.split(' ')
      // BTC(0) DATE(1) CALL/PUT(2) STRIKE(3) => options
      // DATE(0) Next-Day(1) BTC(2) => swaps
      let strike =
        contractDetails.length > 3
          ? parseInt(
            contractDetails[3]
              .slice(1)
              .split(',')
              .join('')
          )
          : null
      let parsed = {
        // exchange id hardcoded to ledgerx for now
        exchange_id: 1,
        expiry_date:
          contract.contract_type == 'options_contract'
            ? contractDetails[1]
            : contractDetails[0],
        contract_type: contract.contract_type,
        option_type:
          contract.contract_type == 'options_contract' &&
          contract.contract_is_call
            ? 'call'
            : contract.contract_type == 'options_contract' &&
              !contract.contract_is_call
              ? 'put'
              : null,
        option_strike:
          contract.contract_type == 'options_contract' ? strike : null,
        contract_ccy:
          contract.contract_type == 'options_contract'
            ? contractDetails[0]
            : contractDetails[2],
        expired: false
      }
      return_arr.push(parsed)
    }
  }

  return return_arr
}

async function parseTrades (raw) {
  const return_arr = []
  try {
    let activeDict = {}
    const activeContracts = await axios.get(`${host}contracts/options/active`)

    for (let contract of activeContracts.data.contracts) {
      // need to split on T to eliminate time zone date differentials
      activeDict[
        `${moment(contract.expiry_date.split('T')[0]).format('YYYY-MM-DD')} ${
          contract.option_strike
        } ${contract.option_type}`
      ] = contract.id
    }
    // console.log(activeDict)
    for (let contract of raw) {
      if (
        contract.contract_type == 'options_contract' &&
        contract.volume !== 0
      ) {
        const contractDetails = contract.contract_label.split(' ')
        const strike =
          contractDetails.length > 3
            ? parseInt(
              contractDetails[3]
                .slice(1)
                .split(',')
                .join('')
            )
            : null
        const putOrCall = contractDetails[2].toLowerCase()
        const identifierString = `${contractDetails[1]} ${strike} ${putOrCall}`

        const daysLeft = moment(contractDetails[1]).diff(moment(), 'days')

        let parsed = {
          contract_id: activeDict[identifierString],
          trade_date: today,
          days_till_expiry: daysLeft,
          open_interest: contract.open_interest,
          volume: contract.volume,
          vwap: parseInt(contract.vwap),
          last_bid: parseInt(contract.last_bid),
          last_ask: parseInt(contract.last_ask),
          delta: null,
          implied_vol: null
        }
        return_arr.push(parsed)
      }
    }
  } catch (error) {
    console.log(error)
  }

  return return_arr
}

// pass array of parsed contracts from ledger x as argument
// Instantiate empty hashtable for Contracts
// Get active contracts from db
// insert into hash table
// check passed array against hash table

async function deduplicateContracts (arr) {
  try {
    let activeDict = {}

    const activeContracts = await axios.get(`${host}contracts/options/active`)

    if (activeContracts.data.contracts.length === 0) {
      return arr
    }

    for (let contract of activeContracts.data.contracts) {
      activeDict[
        `${moment(contract.expiry_date).format('YYYY-MM-DD')} ${
          contract.option_strike
        } ${contract.option_type}`
      ] = true
    }

    let newContractArr = []

    for (let contract of arr) {
      if (
        activeDict[
          `${contract.expiry_date} ${contract.option_strike} ${
            contract.option_type
          }`
        ] !== true
      ) {
        console.log('This is a new contract.')
        newContractArr.push(contract)
      } else {
        console.log('Contract already exists.')
      }
    }

    return newContractArr
  } catch (error) {
    console.log('in the parse trade error block')
    console.log(error)
  }
}

async function postContracts (arr) {
  const req = { data: arr }
  await axios.post(`${host}contracts/`, req)
  return 'Success'
}

async function postTrades (arr) {
  const req = { data: arr }
  // console.log('data sent to endpoint', req)
  axios
    .post(`${host}trades/`, req)
    .then(res => console.log(res.data, res.status))
    .catch(error => console.log('error in trade post'))
}

async function contractHelper () {
  try {
    const parsedContracts = parseContracts(await getContracts())
    const uniqueContracts = await deduplicateContracts(parsedContracts)

    //  add contracts to DB if there are new ones
    if (uniqueContracts.length) {
      await postContracts(uniqueContracts)
      console.log(`${uniqueContracts.length} contracts added successfully.`)
      return 'Success'
    } else {
      console.log('No new contracts were released today.')
    }
  } catch (error) {
    console.log(error)
  }
}

async function tradeHelper () {
  try {
    // get trades from LX and parse them
    const rawTrades = await getContracts()
    const parsedTrades = await parseTrades(rawTrades)

    //  add trades to DB if there are new ones
    if (parsedTrades.length) {
      await postTrades(parsedTrades)
      console.log(`${parsedTrades.length} trades added successfully.`)
      return 'Success'
    } else {
      console.log('No trades occured today.')
    }
  } catch (error) {
    console.log(error)
  }
}



module.exports = { contractHelper, tradeHelper }

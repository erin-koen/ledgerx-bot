const router = require('express').Router()
const Contracts = require('../models/ContractModel.js')
const format = require('date-fns/format')

//  add contracts
router.post('/', async (req, res) => {
  const contracts = req.body.data
  try {
    const id = await Contracts.addContracts(contracts)
    res.status(201).json({ last_contract_id: id })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message:
        'Sorry, something went wrong while adding the contracts to the db.',
      error: error
    })
  }
})

// get largest trade by date
router.get('/options/greatest/:date', async (req, res) => {
  const { date } = req.params
  // const date = format(new Date(dateArr[0], dateArr[1], dateArr[2]), 'yyyy-MM-dd')
  // console.log(date)

  try {
    const contracts = await Contracts.findGreatestByDate(
      'options_contract',
      date
    )
    res.status(200).json({ contracts: contracts })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message:
        'Sorry, something went wrong while getting the contracts from the db.',
      error: error
    })
  }
})

// get total trades by date
router.get('/options/sum/:date', async (req, res) => {
  const { date } = req.params
  try {
    const sum = await Contracts.findSumByDate('options_contract', date)
    res.status(200).json({ total: sum })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message:
        'Sorry, something went wrong while getting the contracts from the db.',
      error: error
    })
  }
})

// get expiring contracts by date
router.get('/options/expiring/:date', async (req, res) => {
  const { date } = req.params
  console.log(date)
  try {
    const contracts = await Contracts.findBy({ expiry_date: date })
    let message = ''
    if (contracts.length) {
      message = `${contracts.length} contracts expiring on ${date}.`
    } else {
      message = `No contracts expiring on ${date}.`
    }
    res.status(200).json({ message: message, contracts: contracts })
  } catch (error) {
    res.status(500).json({
      message:
        'Sorry, something went wrong while getting the contracts from the db.',
      error: error
    })
  }
})

router.get('/options/active', async (req, res) => {
  try {
    const contracts = await Contracts.findBy({ expired: false })
    let message = ''
    if (contracts.length) {
      message = `${contracts.length} contracts are currently active.`
    } else {
      message = `No contracts are currently active.`
    }

    res.status(200).json({ message: message, contracts: contracts })
  } catch (error) {
    res.status(500).json({
      message:
        'Sorry, something went wrong while getting the contracts from the db.',
      error: error
    })
  }
})

module.exports = router

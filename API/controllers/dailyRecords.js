const router = require('express').Router()
const Trades = require('../models/DailyRecordModel.js')
const moment = require('moment')

const today = moment().format('YYYY-MM-DD')

router.post('/', async (req, res) => {
  const trades = req.body.data
  try {
    const message = await Trades.add(trades)
    res.status(201).json({ message: message })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Sorry, something went wrong while adding trades to the db.'
    })
  }
})

router.get('/max/:date', async (req, res) => {
  const {date} = req.params
  try {
    const mostTraded = await Trades.getMaxByDate(date)
    res.status(200).json(mostTraded)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message:
        'Sorry, something went wrong while getting the contracts from the db.',
      error: error
    })
  }
})

router.get('/total/:date', async (req, res) => {
  const {date} = req.params
  try {
    const total = await Trades.getDailyTotal(date)
    res.status(200).json({
      message: `${total} options contracts traded on LedgerX today.`,
      total: parseInt(total)
    })
  } catch (error) {
      res.status(500).json({
        message:
        'Sorry, something went wrong while getting the total from the db.',
      error: error
      })
  }
})

module.exports = router

// add a daily record
// get sum of daily record volumes by date
// get largest volume of daily record by date
//

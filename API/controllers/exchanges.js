const router = require('express').Router()
const Exchanges = require('../models/ExchangeModel.js')

router.post('/', async (req, res) => {
  const newExchange = req.body
  try {
    const exchange = await Exchanges.addExchange(newExchange)
    console.log(exchange)
    res
      .status(201)
      .json({

        message: `${exchange} exchange added successfully.`

      })
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          'Sorry, something went wrong while adding the exchange to the database.',
        error: error
      })
  }
})

module.exports = router
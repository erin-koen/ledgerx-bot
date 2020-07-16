const axios = require('axios')

const endpoint = 'https://bitcoin-options-data.herokuapp.com/api/exchanges/'
// const endpoint = 'http://localhost:8000/api/exchanges/'

const ledgerX = {
    name: "LedgerX"
}

// TODO - add more graceful error handling here
function addLedgerX(){
    axios.post(endpoint, ledgerX).then(res => console.log(res.data.message)).catch(error=>console.log(error))
}

module.exports = {
    addLedgerX
}
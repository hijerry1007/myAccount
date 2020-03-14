const express = require('express')
const router = express.Router()
const Record = require('./models/record')
// model

router.get('/', (req, res) => {
  res.send('index')
})

module.exports = router
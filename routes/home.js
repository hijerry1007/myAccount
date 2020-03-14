const express = require('express')
const router = express.Router()

// model

router.get('/', (req, res) => {
  res.send('index')
})

module.exports = router
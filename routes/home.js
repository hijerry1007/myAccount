const express = require('express')
const router = express.Router()
const Record = require('../models/record')
// model

// home page
router.get('/', (req, res) => {
  Record.find()
    .lean()
    .exec((err, records) => {
      if (err) return console.error(err)
      return res.render('index', { records: records })

    })
})

module.exports = router
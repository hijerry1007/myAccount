const express = require('express')
const router = express.Router()

// model
const Record = require('../models/record')

// 驗證是否登入
const { authenticated } = require('../config/auth')

// home page
router.get('/', authenticated, (req, res) => {
  Record.find({ userId: req.user._id })
    .lean()
    .exec((err, records) => {
      if (err) return console.error(err)
      let totalAmount = 0
      for (let i = 0; i < records.length; i++) {
        console.log(records[i].amount)
        totalAmount += records[i].amount
      }
      return res.render('index', { records: records, totalAmount: totalAmount })
    })
})

module.exports = router
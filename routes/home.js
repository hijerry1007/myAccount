const express = require('express')
const router = express.Router()

// model
const Record = require('../models/record')

// 驗證是否登入
const { authenticated } = require('../config/auth')

// home page
router.get('/', authenticated, (req, res) => {
  Record.find()
    .lean()
    .exec((err, records) => {
      if (err) return console.error(err)
      return res.render('index', { records: records })
    })
})

module.exports = router
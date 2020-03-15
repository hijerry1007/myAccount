const express = require('express')
const router = express.Router()

// model
const Record = require('../models/record')
const category = require('../data/category.json').category
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
        totalAmount += records[i].amount
      }
      return res.render('index', { records: records, totalAmount: totalAmount, category })
    })
})

//filter
router.post('/filter', authenticated, (req, res) => {
  let { selectedCategory } = req.body
  const filter_category = (selectedCategory === 'all') ? {} : { category: selectedCategory }

  Record
    .find({ userId: req.user._id })
    .find(filter_category)
    .lean()
    .exec((err, records) => {
      if (err) return console.error(err)
      let totalAmount = 0
      for (let i = 0; i < records.length; i++) {
        totalAmount += records[i].amount
      }
      return res.render('index', { records: records, totalAmount: totalAmount, category })
    })
})

module.exports = router
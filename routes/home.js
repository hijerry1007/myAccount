const express = require('express')
const router = express.Router()

// model
const Record = require('../models/record')
const category = require('../data/category.json').category
const month = require('../data/month.json').month
const year = require('../data/yearGenerator')
// 驗證是否登入
const { authenticated } = require('../config/auth')


// home page
router.get('/', authenticated, (req, res) => {
  console.log(req.query)
  let { dateBeg, dateEnd, selectedCategory } = req.query
  let errors = []
  const filter_category = (selectedCategory === 'all') ? {} : { category: selectedCategory }
  const filterTime = {
    date: {
      $gte: dateBeg, $lte: dateEnd
    }
  }
  //有時間有類別
  if (dateBeg !== '' && dateEnd !== '' && selectedCategory !== '') {

    Record.find({ userId: req.user._id })
      .find({ filter_category })
      .find({ filterTime })
      .lean()
      .exec((err, records) => {
        if (err) return console.error(err)
        let totalAmount = 0
        for (let i = 0; i < records.length; i++) {
          totalAmount += records[i].amount
        }
        return res.render('index', { records: records, totalAmount: totalAmount, category: category, month: month, year: year, errors })
      })
  }
  else if (dateBeg === '' && dateEnd === '' && selectedCategory !== '') {
    //有類別沒時間
    Record.find({ userId: req.user._id })
      .find({ filter_category })
      .lean()
      .exec((err, records) => {
        if (err) return console.error(err)
        let totalAmount = 0
        for (let i = 0; i < records.length; i++) {
          totalAmount += records[i].amount
        }
        return res.render('index', { records: records, totalAmount: totalAmount, category: category, month: month, year: year, errors })
      })
  }
  else if ((dateBeg === '' && dateEnd !== '') || (dateBeg !== '' && dateEnd === '')) {
    //錯誤情形
    errors.push({ message: '請選擇要搜尋的起始及結束的時間' })
    Record
      .find({ userId: req.user._id })
      .find({ filter_category })
      .lean()
      .exec((err, records) => {
        if (err) return console.error(err)
        let totalAmount = 0
        for (let i = 0; i < records.length; i++) {
          totalAmount += records[i].amount
        }
        return res.render('index', { records: records, totalAmount: totalAmount, category: category, month: month, year: year, errors })
      })
  }
  else {

    Record
      .find({ userId: req.user._id })
      .lean()
      .exec((err, records) => {
        if (err) return console.error(err)
        let totalAmount = 0
        for (let i = 0; i < records.length; i++) {
          totalAmount += records[i].amount
        }
        return res.render('index', { records: records, totalAmount: totalAmount, category: category, month: month, year: year })
      })
  }
})

//filter
router.post('/filter', authenticated, (req, res) => {
  console.log(req.query)
  let { selectedYear, selectedMonth, selectedCategory } = req.body
  let errors = []
  if (selectedYear === 'all' && selectedMonth !== "all") {
    errors.push({ message: '請輸入年份' })
    Record.find({ userId: req.user._id })
      .lean()
      .exec((err, records) => {
        if (err) return console.error(err)
        let totalAmount = 0
        for (let i = 0; i < records.length; i++) {
          totalAmount += records[i].amount
        }
        return res.render('index', { records: records, totalAmount: totalAmount, category: category, month: month, year: year, errors })
      })
  }
  else if (selectedYear !== 'all' && selectedMonth !== "all") {
    const filterTime = {
      date: {
        $gte: `${selectedYear}-${+selectedMonth}-01`, $lte: `${selectedYear}-${+selectedMonth}-31`
      }
    }
    const filter_category = (selectedCategory === 'all') ? {} : { category: selectedCategory }
    Record
      .find({ userId: req.user._id })
      .find(filter_category)
      .find(filterTime)
      .lean()
      .exec((err, records) => {
        if (err) return console.error(err)
        let totalAmount = 0
        for (let i = 0; i < records.length; i++) {
          totalAmount += records[i].amount
        }
        return res.render('index', { records: records, totalAmount: totalAmount, category: category, month: month, year: year })
      })
  }
  else if (selectedYear !== 'all' && selectedMonth === "all") {
    const filterYear = {
      date: {
        $gte: `${selectedYear}-01-01`, $lte: `${selectedYear}-12-31`
      }
    }
    const filter_category = (selectedCategory === 'all') ? {} : { category: selectedCategory }
    Record
      .find({ userId: req.user._id })
      .find(filter_category)
      .find(filterYear)
      .lean()
      .exec((err, records) => {
        if (err) return console.error(err)
        let totalAmount = 0
        for (let i = 0; i < records.length; i++) {
          totalAmount += records[i].amount
        }
        return res.render('index', { records: records, totalAmount: totalAmount, category: category, month: month, year: year })
      })
  }
  else if (selectedYear === 'all' && selectedMonth === "all") {
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
        return res.render('index', { records: records, totalAmount: totalAmount, category: category, month: month, year: year })
      })
  }


})

module.exports = router
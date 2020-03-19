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
  // 分頁
  let pageSize = 3
  let currentPage = 1
  let pageNumber = req.query.page || 1
  let offset = (pageNumber - currentPage) * pageSize


  let { dateBeg, dateEnd, selectedCategory } = req.query
  let errors = []
  const filter_category = (selectedCategory === 'all') ? {} : { category: selectedCategory }
  const filterTime = (dateBeg === 'all' && dateEnd === 'all') ? {} :
    {
      date: { $gte: dateBeg, $lte: dateEnd }
    }


  //首頁
  if (!dateBeg && !dateEnd && !selectedCategory) {
    Record
      .find({ userId: req.user._id })
      .sort({ _id: 1 })
      .lean()
      .exec((err, records) => {
        if (err) return console.error(err)

        let totalPages = Math.ceil(records.length / pageSize) || 1
        const pages = []
        for (let i = 1; i < totalPages + 1; i++) {
          pages.push({ page: i })
        }
        let pageData = records.slice(offset, offset + pageSize)
        console.log(pageData)
        let totalAmount = 0
        for (let i = 0; i < records.length; i++) {
          totalAmount += records[i].amount
        }
        return res.render('index', { records: records, totalAmount: totalAmount, category: category, month: month, year: year, pages, pageData, pageNumber })
      })

  }
  else if (dateBeg === '' && dateEnd === '' && selectedCategory !== '') {
    //有類別沒時間
    Record.find({ userId: req.user._id })
      .find(filter_category)
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
  else if (dateBeg !== '' && dateEnd !== '') {
    Record.find({ userId: req.user._id })
      .find(filter_category)
      .find(filterTime)
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

})


module.exports = router
const express = require('express')
const router = express.Router()


// model
const Record = require('../models/record')

// 驗證
const { authenticated } = require('../config/auth')

// 首頁
router.get('/', authenticated, (req, res) => {
  res.redirect('/')
})

// 圖表頁面
router.get('/chart', authenticated, (req, res) => {
  Record.find({ userId: req.user._id })
    .lean()
    .exec((err, records) => {
      if (err) return console.error(err)

      let homeAmount = 0
      let foodAmount = 0
      let transportAmount = 0
      let entertainmentAmount = 0
      let otherAmount = 0
      records.forEach(record => {
        homeAmount += record.categoryAmount[0]
        foodAmount += record.categoryAmount[1]
        transportAmount += record.categoryAmount[2]
        entertainmentAmount += record.categoryAmount[3]
        otherAmount += record.categoryAmount[4]
      })

      let totalAmount = homeAmount + foodAmount + transportAmount + entertainmentAmount + otherAmount
      return res.render('chart', { records, totalAmount, homeAmount, foodAmount, transportAmount, entertainmentAmount, otherAmount })
    })


})

// 新增頁面
router.get('/new', authenticated, (req, res) => {
  res.render('new')
})
// 新增post
router.post('/', authenticated, (req, res) => {
  let initialCategoryAmount = [0, 0, 0, 0, 0]
  // [home, food, transport, entertainment, other]
  const record = new Record({
    name: req.body.name,
    date: req.body.date,
    category: req.body.category,
    amount: req.body.amount,
    shop: req.body.shop,
    userId: req.user._id,
    categoryAmount: initialCategoryAmount
  })

  if (record.category === '家居物業') {
    record.categoryAmount[0] += record.amount
  }
  if (record.category === '餐飲食品') {
    record.categoryAmount[1] += record.amount
  }
  if (record.category === '運輸交通') {
    record.categoryAmount[2] += record.amount
  }
  if (record.category === '休閒娛樂') {
    record.categoryAmount[3] += record.amount
  }
  if (record.category === '其他') {
    record.categoryAmount[4] += record.amount
  }

  record.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })
})
// 修改頁面
router.get('/:id/edit', authenticated, (req, res) => {
  Record.findById({ _id: req.params.id, userId: req.user._id })
    .lean()
    .exec((err, record) => {
      if (err) return console.error(err)
      return res.render('edit', { record: record })
    })
})
// 修改post
router.put('/:id', authenticated, (req, res) => {
  const { name, date, category, amount } = req.body
  let errors = []

  if (!name || !date || !category || !amount) {
    errors.push({ message: '所有欄位都是必填' })
  };

  if (errors.length > 0) {
    Record.findById({ _id: req.params.id, userId: req.user._id })
      .lean()
      .exec((err, record) => {
        if (err) return console.error(err)
        return res.render('edit', { record: record, errors })
      })
  }
  else {
    Record.findById({ _id: req.params.id, userId: req.user._id }, (err, record) => {
      if (err) return console.error(err)

      if (record.category === '家居物業') {
        record.categoryAmount[0] -= record.amount
        record.amount = req.body.amount
        record.categoryAmount[0] += record.amount
      }
      if (record.category === '餐飲食品') {
        record.categoryAmount[1] -= record.amount
        record.amount = req.body.amount
        record.categoryAmount[1] += record.amount
      }
      if (record.category === '運輸交通') {
        record.categoryAmount[2] -= record.amount
        record.amount = req.body.amount
        record.categoryAmount[0] += record.amount
      }
      if (record.category === '休閒娛樂') {
        record.categoryAmount[3] -= record.amount
        record.amount = req.body.amount
        record.categoryAmount[3] += record.amount
      }
      if (record.category === '其他') {
        record.categoryAmount[4] -= record.amount
        record.amount = req.body.amount
        record.categoryAmount[4] += record.amount
      }

      record.name = req.body.name
      record.date = req.body.date
      record.category = req.body.category
      record.shop = req.body.shop
      record.amount = req.body.amount

      record.save(err => {
        if (err) return console.error(err)
        return res.redirect('/')
      })
    })
  }
})
// 刪除
router.delete('/:id', authenticated, (req, res) => {
  Record.findById({ _id: req.params.id, userId: req.user._id }, (err, record) => {
    if (err) return console.error(err)
    record.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
})

module.exports = router
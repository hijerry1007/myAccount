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

// 新增頁面
router.get('/new', authenticated, (req, res) => {
  res.render('new')
})
// 新增post
router.post('/', authenticated, (req, res) => {
  const record = new Record({
    name: req.body.name,
    date: req.body.date,
    category: req.body.category,
    amount: req.body.amount,
    shop: req.body.shop,
    userId: req.user._id
  })
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
      record.name = req.body.name
      record.date = req.body.date
      record.category = req.body.category
      record.amount = req.body.amount
      record.shop = req.body.shop
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
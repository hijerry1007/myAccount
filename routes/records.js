const express = require('express')
const router = express.Router()
const Record = require('../models/record')

// model

// 首頁
router.get('/', (req, res) => {
  res.redirect('/')
})
// 新增頁面
router.get('/new', (req, res) => {
  res.render('new')
})
// 新增post
router.post('/', (req, res) => {
  const record = new Record({
    name: req.body.name,
    date: req.body.date,
    category: req.body.category,
    amount: req.body.amount
  })
  record.save(err => {
    if (err) return console.error(err)
    return res.redirect('/')
  })
})
// 修改頁面
router.get('/:id/edit', (req, res) => {
  Record.findById(req.params.id)
    .lean()
    .exec((err, record) => {
      if (err) return console.error(err)
      return res.render('edit', { record: record })
    })
})
// 修改post
router.post('/:id/edit', (req, res) => {
  Record.findById(req.params.id, (err, record) => {
    if (err) return console.error(err)
    record.name = req.body.name
    record.date = req.body.date
    record.category = req.body.category
    record.amount = req.body.amount
    record.save(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
})
// 刪除
router.post('/:id/delete', (req, res) => {
  Record.findById(req.params.id, (err, record) => {
    if (err) return console.error(err)
    record.remove(err => {
      if (err) return console.error(err)
      return res.redirect('/')
    })
  })
})

module.exports = router
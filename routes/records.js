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
    date: req.body.time,
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
  res.send('edit')
})
// 修改post
router.put('/:id', (req, res) => {
  res.send('edit')
})
// 刪除
router.put('/:id/delete', (req, res) => {
  res.send('delete')
})

module.exports = router
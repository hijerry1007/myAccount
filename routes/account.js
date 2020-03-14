const express = require('express')
const router = express.Router()
// model

// 首頁
router.get('/', (req, res) => {
  res.redirect('/')
})
// 新增頁面
router.get('/new', (req, res) => {
  res.send('new')
})
// 新增post
router.post('/', (req, res) => {
  res.send('new post')
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
const mongoose = require('mongoose')
const Record = require('../record')
const recordList = require('./record.json')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/record', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('db error')
})

db.once('open', () => {
  console.log('db connected!')
  for (let i = 0; i < recordList.results.length; i++) {
    Record.create(recordList.results[i])
  }
})
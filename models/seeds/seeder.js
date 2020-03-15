const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const recordList = require('./record.json')
const userList = require('./usersSeeder.json')

const User = require('../user.js')
const Record = require('../record.js')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/record', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('db error')
})

db.once('open', () => {
  console.log('db connected!')

  userList.users.forEach((user, index) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) throw err

        User.create({
          name: user.name,
          email: user.email,
          password: hash
        })
          .then(user => {
            const records = index ? recordList.results.slice(4, 6) : recordList.results.slice(0, 3)
            records.forEach(record => {
              Record.create({
                name: record.name,
                category: record.category,
                amount: record.amount,
                date: record.date,
                userId: user._id
              })
            })
          })
      })
    })
  })
  console.log('done')
})
const express = require('express')
const app = express()

app.use('/', require('./routes/home'))
app.use('/accounts', require('./routes/account'))


app.listen(3000, () => {
  console.log('App is running')
})
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const handlebars = require("handlebars")
const methodOverride = require('method-override')
const session = require('express-session')


app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

mongoose.connect('mongodb://localhost/record', { useNewUrlParser: true, useUnifiedTopology: true })


const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected')
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))
app.use(session({
  secret: 'save money',
  resave: false,
  saveUninitialized: true,
}))
app.use('/', require('./routes/home'))
app.use('/record', require('./routes/records'))
app.use('/users', require('./routes/user'))

handlebars.registerHelper('if_equal', function (category, input, options) {
  if (category === input) {
    return options.fn(this);
  }
  return options.inverse(this);
});

app.listen(3000, () => {
  console.log('App is running')
})
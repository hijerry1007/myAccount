const express = require('express')
const app = express()
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const handlebars = require("handlebars")
const methodOverride = require('method-override')
const session = require('express-session')

// 載入passport
const passport = require('passport')


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
app.use(passport.initialize())
app.use(passport.session())
app.use('/', require('./routes/home'))
app.use('/record', require('./routes/records'))
app.use('/users', require('./routes/user'))

// 載入passport config
require('./config/passport')(passport)
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

handlebars.registerHelper('if_equal', function (category, input, options) {
  if (category === input) {
    return options.fn(this);
  }
  return options.inverse(this);
});

app.listen(3000, () => {
  console.log('App is running')
})
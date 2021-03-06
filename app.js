const express = require('express')
// 判斷開發環境
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express()
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const handlebar = require("handlebars")
const handlebarHelpers = require('handlebars-helpers')
const flash = require('connect-flash')

// 載入passport
const passport = require('passport')


app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/record', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })


const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected')
})

app.use(session({
  secret: 'savemoney',
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

// 載入passport config
require('./config/passport')(passport)

app.use(flash())
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.error_msg = req.flash('error')
  next()
})


app.use('/', require('./routes/home'))
app.use('/record', require('./routes/records'))
app.use('/users', require('./routes/user'))
app.use('/auth', require('./routes/auths'))

handlebar.registerHelper('if_equal', function (category, input, options) {
  if (category === input) {
    return options.fn(this);
  }
  return options.inverse(this);
});

handlebar.registerHelper('isSelected', function (selected, current, options) {
  return selected === current ? 'selected' : ''
})

app.listen(process.env.PORT || 3000, () => {
  console.log('App is running')
})
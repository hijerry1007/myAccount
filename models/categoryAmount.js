const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categoryAmountSchema = new Schema
  ({
    home: {
      type: Number
    },
    food: {
      type: Number
    },
    transport: {
      type: Number
    },
    entertainment: {
      type: Number
    },
    other: {
      type: Number
    },
  })

module.exports = mongoose.model('CategoryAmount', categoryAmountSchema)
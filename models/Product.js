const mongoose = require('mongoose');
const moment = require('moment')

const productSchema = mongoose.Schema({
  category: {
    type: String
  },
  product_name: {
    type: String
  },
  product_name_en: {
    type: String
  },
  content: {
    type: String
  },
  recommend: {
    type: String
  },
  standard: {
    type: Number
  },
  kcal: {
    type: Number
  },
  sat_FAT: {
    type: Number
  },
  protein: {
    type: Number
  },
  sodium: {
    type: Number
  },
  sugars: {
    type: Number
  },
  caffeine: {
    type: Number
  },
  img: {
    type: String
  },
  create_date: {
    type: String,
    default: moment().format("YYYY-MM-DD HH:mm:ss")
  },
  update_date: {
    type: String
  }
})

const Product = mongoose.model('product', productSchema);

module.exports = { Product }
const mongoose = require('mongoose');

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
    type: Date
  },
  update_date: {
    type: Date
  }
})

const Product = mongoose.model('product', productSchema);

module.exports = { Product }
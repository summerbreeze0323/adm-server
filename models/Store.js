const mongoose = require('mongoose');
const moment = require('moment');

const storeSchema = mongoose.Schema({
  store: {
    type: String
  },
  tel: {
    type: String
  },
  sido: {
    type: String
  },
  gugun: {
    type: String
  },
  address: {
    type: String
  },
  jibunAddress: {
    type: String
  },
  addressDetail: {
    type: String
  },
  zonecode: {
    type: String
  },
  lat: {
    type: String
  },
  lot: {
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

const Store = mongoose.model('store', storeSchema)

module.exports = { Store }
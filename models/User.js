const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  birth: {
    type: Date,
  },
  gender: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  join_date: {
    type: Date,
  },
  shopping_history: {
    type: Array,
  }
});

const User = mongoose.model('user', userSchema);

module.exports = { User }
const mongoose = require('mongoose');

const oneSchema = mongoose.Schema({
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
});

const One = mongoose.model('one', oneSchema);

module.exports = { oneSchema, One };

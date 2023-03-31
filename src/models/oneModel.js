const mongoose = require('mongoose');

const oneSchema = mongoose.Schema({
  // testing purpose only
  test_string: String,
  test_number: Number,
  test_any: String,
},
 {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
  },
);

const One = mongoose.model('one', oneSchema);

module.exports = { oneSchema, One };

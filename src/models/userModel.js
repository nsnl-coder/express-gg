const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
    },
  },
  { toJSON: {}, timestamps: true },
);

const User = mongoose.model('UserModel', userSchema);

module.exports = { User, userSchema };

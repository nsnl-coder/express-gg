import { Schema, model } from 'mongoose';

const userSchema = new Schema(
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

const User = model('UserModel', userSchema);

export { User, userSchema };

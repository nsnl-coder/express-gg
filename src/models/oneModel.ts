import { Schema, model } from 'mongoose';
import { IOne } from '../yup/oneSchema';

const oneSchema = new Schema<IOne>(
  {
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

const One = model<IOne>('one', oneSchema);

export { oneSchema, One };

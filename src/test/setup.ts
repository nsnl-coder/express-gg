import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel';

let mongo: any;

// function that run before all of tests
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
});

// function run before each test
beforeEach(async () => {
  process.env.JWT_SECRET = 'some-secret';
  process.env.JWT_EXPIRES_IN = '3d';
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// function that run after all of tests
afterAll(async () => {
  if (mongo) {
    await mongo.stop();
    await mongoose.connection.close();
  }
});

//
afterEach(() => {
  jest.clearAllMocks();
});

const signJwtToken = (id: string) => {
  if (!process.env.JWT_SECRET) {
    console.log('Can not find secret');
    return;
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const jwt2Cookie = (jwt: any) => {
  return [`jwt=${jwt}; Path=/; HttpOnly`];
};

const signup = async (payload: any) => {
  const user = await User.create({
    email: 'test@test.com',
    isVerified: true,
    role: 'user',
    ...payload,
  });

  const jwt = signJwtToken(user._id.toString());
  const cookie = jwt2Cookie(jwt);

  return { cookie };
};

export { signup, jwt2Cookie };

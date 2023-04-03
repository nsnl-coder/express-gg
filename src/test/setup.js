const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { User } = require('../models/userModel');

let mongo;

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

const signJwtToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const jwt2Cookie = (jwt) => {
  return [`jwt=${jwt}; Path=/; HttpOnly`];
};

global.signup = async (payload) => {
  const user = await User.create({
    email: 'test@test.com',
    isVerified: true,
    role: 'user',
    ...payload,
  });

  const jwt = signJwtToken(user._id);
  const cookie = jwt2Cookie(jwt);

  return { cookie };
};

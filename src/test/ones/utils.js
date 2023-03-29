const request = require('supertest');
const { app } = require('../../config/app');

// TODO:

// 1. Handle all auth check in all route
// 2. Handle required fields in create route
// 3. Handle data validation in updateOne, updateManyOnes, createOne (can copy code)
// 4. Handle objectid does not exist in req.body (if has)
// 5. Handle sideeffect when delete one, or delete many ones

const createOne = async (data) => {
  const { body } = await request(app)
    .post('/api/ones')
    .send({
      test_string: 'testname',
      test_number: 10,
      test_any: 'draft',
      ...data,
    });

  return body.data;
};

module.exports = { createOne };

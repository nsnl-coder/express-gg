const request = require('supertest');
const { app } = require('../../config/app');

const createOne = async (data) => {
  const { body } = await request(app)
    .post('/api/ones')
    .send({
      name: 'testname',
      price: 10,
      status: 'draft',
      ...data,
    });

  return body.data;
};

module.exports = { createOne };

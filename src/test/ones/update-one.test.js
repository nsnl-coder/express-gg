const request = require('supertest');
const { app } = require('../../config/app');
const { createOne } = require('./utils');

it('shoud update the one', async () => {
  // create a one
  const one = await createOne();
  expect(one.price).toEqual(10);

  // update one
  const { body } = await request(app)
    .put(`/api/ones/${one._id}`)
    .send({
      price: 24,
    })
    .expect(200);

  expect(body.data.price).toEqual(24);
});

it('should return error if objectid is not valid', async () => {
  // update one
  const { body } = await request(app)
    .put('/api/ones/not-valid-objectid')
    .send({
      price: 24,
    })
    .expect(400);

  expect(body.message).toEqual('Data validation failed');
  expect(body.errors).toContain('Invalid ObjectId');
});

it('should return error if objectid does not exist in db', async () => {
  // update one
  const { body } = await request(app)
    .put('/api/ones/00000020f51bb4362eee2a4d')
    .send({
      price: 24,
    })
    .expect(404);

  expect(body.message).toEqual('Can not find one with provided id');
});

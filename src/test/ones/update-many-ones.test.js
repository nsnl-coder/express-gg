const request = require('supertest');
const { app } = require('../../config/app');
const { createOne } = require('./utils');

// TODO: check for requireLogin, requireLogin, data validation

it('returns 200 & successfully update the ones', async () => {
  // create a one
  let one1 = await createOne();

  // create a one
  let one2 = await createOne();

  //
  expect(one1.price).toEqual(10);
  expect(one2.price).toEqual(10);

  // update one
  const id1 = one1._id;
  const id2 = one2._id;

  const response = await request(app)
    .put('/api/ones')
    .send({
      updateList: [id1, id2],
      price: 24,
    })
    .expect(200);

  expect(response.body.modifiedCount).toEqual(2);

  // double check
  one1 = await request(app).get(`/api/ones/${id1}`);
  one2 = await request(app).get(`/api/ones/${id2}`);
  expect(one1.body.data.price).toEqual(24);
  expect(one2.body.data.price).toEqual(24);
});

it('should return error if updateList contains invalid objectid', async () => {
  const response = await request(app)
    .put('/api/ones')
    .send({
      updateList: ['id-not-valid', 'invalid-id'],
      price: 24,
    })
    .expect(400);

  expect(response.body.message).toEqual('Data validation failed');
  expect(response.body.errors).toContain('Invalid ObjectId');
});

it('should return error if updateList contains non-existent objectid', async () => {
  const response = await request(app)
    .put('/api/ones')
    .send({
      updateList: ['507f191e810c19729de860ea', '00000020f51bb4362eee2a4d'],
      price: 24,
    })
    .expect(404);

  expect(response.body.message).toEqual('Can not find one with provided ids');
});

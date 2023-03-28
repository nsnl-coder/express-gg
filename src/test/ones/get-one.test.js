const request = require('supertest');
const { app } = require('../../config/app');

// TODO: need to handle requireLogin, requireRole

it('returns 200 & successfully receives requested one', async () => {
  // create one
  const { body } = await request(app)
    .post('/api/ones')
    .send({
      price: 14,
    })
    .expect(201);

  // get one
  const response = await request(app)
    .get(`/api/ones/${body.data._id}`)
    .expect(200);

  expect(response.body.data._id).toEqual(body.data._id);
});

it('should return error if objectid is not valid objectid', async () => {
  // get one
  const response = await request(app).get(`/api/ones/12345678900`).expect(400);

  expect(response.body.errors).toContain('Invalid ObjectId');
});

it('should return error if objectid is not existed', async () => {
  // get one
  const response = await request(app)
    .get(`/api/ones/507f1f77bcf86cd799439011`)
    .expect(404);

  expect(response.body.message).toEqual('Can not find one with provided id');
});

const request = require('supertest');
const { app } = require('../../config/app');
const { createOne } = require('./utils');

// TODO: need to handle requireLogin, requireRole cases

it('should delete one', async () => {
  // create a one
  let one = await createOne();
  const id = one._id;

  expect(id).toBeDefined();
  await request(app).delete(`/api/ones/${id}`).expect(200);
});

it('should return error if objectid is invalid', async () => {
  const id = 'invalid-object-id';
  const { body } = await request(app).delete(`/api/ones/${id}`).expect(400);
  expect(body.errors).toContain('Invalid ObjectId');
});

it('should return error if objectid does not exist', async () => {
  const id = '00000020f51bb4362eee2a4d';
  const { body } = await request(app).delete(`/api/ones/${id}`).expect(404);

  expect(body.message).toEqual('Cant not find one with provided id');
});

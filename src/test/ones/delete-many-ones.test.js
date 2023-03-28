const request = require('supertest');
const { app } = require('../../config/app');
const { createOne } = require('./utils');

// TODO: need to handle requireLogin, requireRole cases

it('should delete many ones', async () => {
  // create 2 ones
  const one1 = await createOne();
  const one2 = await createOne();

  const id1 = one1._id;
  const id2 = one2._id;

  expect(id1).toBeDefined();
  expect(id2).toBeDefined();

  //delete
  const response = await request(app)
    .delete('/api/ones')
    .send({
      deleteList: [id1, id2],
    })
    .expect(200);

  expect(response.body.deletedCount).toEqual(2);
});

it('should return error if deleteList only contains invalid ObjectId', async () => {
  const response = await request(app)
    .delete('/api/ones')
    .send({
      deleteList: ['invalid-objectid', 'still-invalid-objectid'],
    })
    .expect(400);

  expect(response.body.errors).toContain('Invalid ObjectId');
});

it('should return error if deleteList is non-existent ObjectId', async () => {
  const response = await request(app)
    .delete('/api/ones')
    .send({
      deleteList: ['00000020f51bb4362eee2a4d', '00000020f51bb4362eee2a4d'],
    })
    .expect(404);

  expect(response.body.message).toEqual('Can not find ones with provided ids');
});

it('should delete ones if deleteList contains at least one existent objectid', async () => {
  // create one
  const one = await createOne();
  const id = one._id;
  expect(id).toBeDefined();

  // deleteList contain one valid but non-existent objectid
  const response = await request(app)
    .delete('/api/ones')
    .send({
      deleteList: [id, '00000020f51bb4362eee2a4d'],
    })
    .expect(200);

  expect(response.body.deletedCount).toEqual(1);
});

const request = require('supertest');
const { app } = require('../../config/app');

it('returns 200 & successfully creates one', async () => {
  const { body } = await request(app)
    .post('/api/ones')
    // TODO: need to send different payload of send() function
    .send({
      name: 'testname',
      price: 20,
    })
    .expect(201);

  expect(body.data.name).toBe('testname');
  expect(body.data.price).toBe(20);
});

// TODO: handle the fail cases such as:
// missing required fields
// data validation wrong
// requireLogin
// requireRole

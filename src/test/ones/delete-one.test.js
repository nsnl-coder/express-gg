const request = require('supertest');
const { app } = require('../../config/app');
const { createOne } = require('./utils');

let cookie;

beforeEach(() => {
  cookie = '';
});

// TODO:
// 1. if public route => dont need auth check
// 2. if requireLogin => need first 2
// 3. if requireRole => need all

describe.skip('auth check', () => {
  it('should return error if user is not logged in', async () => {
    cookie = '';
    await request(app).post('/api/ones').set('Cookie', cookie).expect(401);
  });

  it('should return error if user is not verified', async () => {
    cookie = signup({ isVerified: false });
    const response = await request(app)
      .post('/api/ones')
      .set('Cookie', cookie)
      .expect(401);

    expect(response.body).toEqual(
      'Please verified your email to complete this action!',
    );
  });

  it('should return error if user is not admin', async () => {
    cookie = signup({ role: 'user' });

    const { body } = await request(app)
      .post('/api/ones')
      .set('Cookie', cookie)
      .expect(403);

    expect(body.message).toEqual(
      'You do not have permission to perform this action',
    );
  });
});

// ===========================================
it('should delete one', async () => {
  let one = await createOne();
  const id = one._id;
  expect(id).toBeDefined();

  await request(app)
    .delete(`/api/ones/${id}`)
    .set('Cookie', cookie)
    .expect(200);
});

it('should return error if objectid is invalid', async () => {
  const id = 'invalid-object-id';
  const { body } = await request(app)
    .delete(`/api/ones/${id}`)
    .set('Cookie', cookie)
    .expect(400);
  expect(body.errors).toContain('Invalid ObjectId');
});

it('should return error if objectid does not exist', async () => {
  const id = '00000020f51bb4362eee2a4d';
  const { body } = await request(app)
    .delete(`/api/ones/${id}`)
    .set('Cookie', cookie)
    .expect(404);

  expect(body.message).toEqual('Cant not find one with provided id');
});

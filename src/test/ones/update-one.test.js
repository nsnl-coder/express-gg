const request = require('supertest');
const { app } = require('../../config/app');
const { createOne } = require('./utils');

let cookie;

beforeEach(() => {
  cookie = '';
});

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

describe.skip('data validation', () => {
  it('should return error if validation fail', async () => {
    const { body } = await request(app)
      .post('/api/ones')
      .send({})
      .set('Cookie', cookie)
      .expect(403);
  });
});

// ===========================================

it('shoud update the one', async () => {
  const one = await createOne();
  expect(one.test_number).toEqual(10);

  const { body } = await request(app)
    .put(`/api/ones/${one._id}`)
    .send({
      test_number: 24,
      test_string: 'updated',
    })
    .set('Cookie', cookie)
    .expect(200);

  expect(body.data.test_number).toEqual(24);
  expect(body.data.test_string).toEqual('updated');
});

it('should return error if objectid is not valid', async () => {
  const { body } = await request(app)
    .put('/api/ones/not-valid-objectid')
    .send({
      test_number: 24,
    })
    .set('Cookie', cookie)
    .expect(400);

  expect(body.message).toEqual('Data validation failed');
  expect(body.errors).toContain('Invalid ObjectId');
});

it('should return error if objectid does not exist in db', async () => {
  const { body } = await request(app)
    .put('/api/ones/00000020f51bb4362eee2a4d')
    .send({
      test_number: 24,
    })
    .set('Cookie', cookie)
    .expect(404);

  expect(body.message).toEqual('Can not find one with provided id');
});

const request = require('supertest');
const { app } = require('../../config/app');

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
    cookie = signup({ role: 'admin' });

    const { body } = await request(app)
      .post('/api/ones')
      .set('Cookie', cookie)
      .expect(403);

    expect(body.message).toEqual(
      'You do not have permission to perform this action',
    );
  });
});

describe.skip('required fields', () => {
  it('should return error if something is missing', async () => {
    const { body } = await request(app)
      .post('/api/ones')
      .send({})
      .set('Cookie', cookie)
      .expect(400);
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

// =============================================================

it('returns 200 & successfully creates one', async () => {
  const { body } = await request(app)
    .post('/api/ones')
    .set('Cookie', cookie)
    .send({
      test_string: 'testname',
      test_number: 20,
    })
    .expect(201);

  expect(body.data.test_string).toBe('testname');
  expect(body.data.test_number).toBe(20);
});

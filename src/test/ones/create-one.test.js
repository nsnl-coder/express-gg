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

it('returns 200 & successfully creates one', async () => {
  // TODO: handle this route
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

describe.skip('auth check', () => {
  it('should return error if user is not logged in', async () => {
    cookie = '';
    const response = await request(app)
      .post('/api/ones')
      .set('Cookie', cookie)
      .expect(401);

    expect(response.body.message).toBe(
      'You are not logged in! Please logged in to perform the action',
    );
  });

  it('should return error if user is not verified', async () => {
    const { cookie } = await signup({
      isVerified: false,
      email: 'test2@test.com',
    });

    const response = await request(app)
      .post('/api/ones')
      .set('Cookie', cookie)
      .expect(401);

    expect(response.body.message).toEqual(
      'Please verified your email to complete this action!',
    );
  });

  it('should return error if user is not admin', async () => {
    const { cookie } = await signup({
      email: 'test2@test.com',
    });

    cookie = await signup({ role: 'user' });

    const response = await request(app)
      .post('/api/ones')
      .set('Cookie', cookie)
      .expect(403);

    expect(response.body.message).toEqual(
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

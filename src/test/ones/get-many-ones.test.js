const request = require('supertest');
const { app } = require('../../config/app');
const { createOne } = require('./utils');

let cookie;

beforeEach(async () => {
  // create 6 ones
  await createOne({ test_number: 11, test_string: 'a' });
  await createOne({ test_number: 12, test_string: 'd' });
  await createOne({ test_number: 13, test_string: 'c' });
  await createOne({ test_number: 14, test_string: 'e' });
  await createOne({ test_number: 15, test_string: 'f' });
  await createOne({ test_number: 16, test_string: 'b' });

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

// ======================================================

it('should return all ones', async () => {
  const response = await request(app)
    .get('/api/ones')
    .set('Cookie', cookie)
    .expect(200);

  // TODO:
  expect(response.body.data[0].test_string).toEqual('a');
  expect(response.body.data[0].test_number).toEqual(11);
  expect(response.body.data[0].test_any).toEqual('draft');

  expect(response.body.results).toEqual(6);
});

describe('limit fields', () => {
  it('should return one with only 2 selected fields: test_string and test_any', async () => {
    // TODO: fix fields=, fix expect

    const { body } = await request(app)
      .get(`/api/ones?fields=test_string,test_any`)
      .set('Cookie', cookie)
      .expect(200);

    expect(body.data[0].test_string).toEqual('a');
    expect(body.data[0].test_any).toEqual('draft');
    expect(body.data[0].test_number).toBeUndefined();
  });

  it('should return all fields except for excluded field', async () => {
    const { body } = await request(app)
      .get(`/api/ones?fields=-test_any`)
      .set('Cookie', cookie)
      .expect(200);

    expect(body.data[0].test_string).toEqual('a');
    expect(body.data[0].test_number).toEqual(11);
    expect(body.data[0].test_any).toBeUndefined();
  });
});

describe('itemPerPage & page', () => {
  it('should return 2 ones with ?itemsPerPage=2&page=1', async () => {
    const response = await request(app)
      .get('/api/ones?itemsPerPage=2&page=1')
      .set('Cookie', cookie)
      .expect(200);

    expect(response.body.results).toEqual(2);
    expect(response.body.totalPages).toEqual(3);
  });

  it('should returns single one with itemsPerPage=2 and page=2', async () => {
    const response = await request(app)
      .get('/api/ones?itemsPerPage=2&page=2')
      .set('Cookie', cookie)
      .expect(200);

    expect(response.body.results).toEqual(2);
    expect(response.body.totalPages).toEqual(3);
  });

  it('should return 200 despite only itemsPerPage provided', async () => {
    const response = await request(app)
      .get('/api/ones?itemsPerPage=3')
      .set('Cookie', cookie)
      .expect(200);

    expect(response.body.results).toEqual(3);
    expect(response.body.totalPages).toEqual(2);
  });

  it('should return 200 even only page is provided', async () => {
    const response = await request(app)
      .get('/api/ones?page=1')
      .set('Cookie', cookie)
      .expect(200);

    expect(response.body.results).toEqual(6);
    expect(response.body.totalPages).toEqual(1);
  });

  it('should return error if page is 0 or negative number', async () => {
    const response = await request(app)
      .get('/api/ones?page=0')
      .set('Cookie', cookie)
      .expect(400);

    expect(response.body.errors).toContain(
      'query.page must be greater than or equal to 1',
    );

    await request(app).get('/api/ones?page=-4').expect(400);
  });

  it('should return error if itemsPerPage is 0 or negative number', async () => {
    const response = await request(app)
      .get('/api/ones?itemsPerPage=0')
      .set('Cookie', cookie)
      .expect(400);

    expect(response.body.errors).toContain(
      'query.itemsPerPage must be greater than or equal to 1',
    );

    await request(app).get('/api/ones?itemsPerPage=-4').expect(400);
  });
});

describe('sorting', () => {
  // TODO: need to fix

  it('should sort by number from high to low', async () => {
    const { body } = await request(app)
      .get('/api/ones?sort=-test_number')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.data[0].test_number).toEqual(16);
    expect(body.data[1].test_number).toEqual(15);
    expect(body.data[2].test_number).toEqual(14);
  });

  it('should sort by text from a-z', async () => {
    const { body } = await request(app)
      .get('/api/ones?sort=test_string')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.data[0].test_string).toEqual('a');
    expect(body.data[1].test_string).toEqual('b');
    expect(body.data[2].test_string).toEqual('c');
  });
});

it('should work with combination of query types', async () => {
  // TODO:
  const query =
    'fields=test_string,test_number&page=1&itemsPerPage=4&sort=test_number';

  const response = await request(app)
    .get(`/api/ones?${query}`)
    .set('Cookie', cookie)
    .expect(200);

  // check itemsPerPage, page
  expect(response.body.results).toEqual(4);

  // check sort
  expect(response.body.data[0].test_number).toEqual(11);
  expect(response.body.data[1].test_number).toEqual(12);

  // check fields
  expect(response.body.data[0].test_string).toBeDefined();
  expect(response.body.data[0].test_any).toBeUndefined();
});

describe('gt, gte, lt,lte', () => {
  it('return ones that has test_number < 13', async () => {
    const { body } = await request(app)
      .get('/api/ones?test_number[lt]=13')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.results).toEqual(2);
  });

  it('return ones that has test_number <= 13', async () => {
    const { body } = await request(app)
      .get('/api/ones?test_number[lte]=13')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.results).toEqual(3);
  });

  it('return ones that has test_number > 12', async () => {
    const { body } = await request(app)
      .get('/api/ones?test_number[gt]=12')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.results).toEqual(4);
  });

  it('return ones that has test_number >= 12', async () => {
    const { body } = await request(app)
      .get('/api/ones?test_number[gte]=12')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.results).toEqual(5);
  });
});

describe('filter by value', () => {
  it('returns ones has test_number equal to 11 or 14', async () => {
    const { body } = await request(app)
      .get('/api/ones?test_number=11,14&sort=test_number')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.results).toEqual(2);

    expect(body.data[0].test_number).toEqual(11);
    expect(body.data[1].test_number).toEqual(14);
  });

  it('returns ones has test_number equal to 11 or 14 but inputed as hpp polution', async () => {
    const { body } = await request(app)
      .get('/api/ones?test_number=11&sort=test_number&test_number=14')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.results).toEqual(2);

    expect(body.data[0].test_number).toEqual(11);
    expect(body.data[1].test_number).toEqual(14);
  });
});
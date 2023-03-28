const request = require('supertest');
const { app } = require('../../config/app');
const { createOne } = require('./utils');

// TODO: need to handle requireLogin, requireRole cases

let cookie;

beforeEach(async () => {
  // create 6 ones
  await createOne({ price: 11, name: 'a' });
  await createOne({ price: 12, name: 'd' });
  await createOne({ price: 13, name: 'c' });
  await createOne({ price: 14, name: 'e' });
  await createOne({ price: 15, name: 'f' });
  await createOne({ price: 16, name: 'b' });

  cookie = '';
});

it('should return all ones', async () => {
  const response = await request(app)
    .get('/api/ones')
    .set('Cookie', cookie)
    .expect(200);

  // TODO:
  expect(response.body.data[0].name).toEqual('a');
  expect(response.body.data[0].price).toEqual(11);
  expect(response.body.data[0].status).toEqual('draft');

  expect(response.body.results).toEqual(6);
});

describe('limit fields', () => {
  it('should return one with only 2 selected fields: name and status', async () => {
    // TODO: fix fields=, fix expect

    const { body } = await request(app)
      .get(`/api/ones?fields=name,status`)
      .set('Cookie', cookie)
      .expect(200);

    expect(body.data[0].name).toEqual('a');
    expect(body.data[0].status).toEqual('draft');
    expect(body.data[0].price).toBeUndefined();
  });

  it('should return all fields except for excluded field', async () => {
    const { body } = await request(app)
      .get(`/api/ones?fields=-status`)
      .set('Cookie', cookie)
      .expect(200);

    expect(body.data[0].name).toEqual('a');
    expect(body.data[0].price).toEqual(11);
    expect(body.data[0].status).toBeUndefined();
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
      .get('/api/ones?sort=-price')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.data[0].price).toEqual(16);
    expect(body.data[1].price).toEqual(15);
    expect(body.data[2].price).toEqual(14);
  });

  it('should sort by text from a-z', async () => {
    const { body } = await request(app)
      .get('/api/ones?sort=name')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.data[0].name).toEqual('a');
    expect(body.data[1].name).toEqual('b');
    expect(body.data[2].name).toEqual('c');
  });
});

it('should work with combination of query types', async () => {
  // TODO:
  const query = 'fields=name,price&page=1&itemsPerPage=4&sort=price';

  const response = await request(app)
    .get(`/api/ones?${query}`)
    .set('Cookie', cookie)
    .expect(200);

  // check itemsPerPage, page
  expect(response.body.results).toEqual(4);

  // check sort
  expect(response.body.data[0].price).toEqual(11);
  expect(response.body.data[1].price).toEqual(12);

  // check fields
  expect(response.body.data[0].name).toBeDefined();
  expect(response.body.data[0].status).toBeUndefined();
});

describe('gt, gte, lt,lte', () => {
  it('return ones that has price < 13', async () => {
    const { body } = await request(app)
      .get('/api/ones?price[lt]=13')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.results).toEqual(2);
  });

  it('return ones that has price <= 13', async () => {
    const { body } = await request(app)
      .get('/api/ones?price[lte]=13')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.results).toEqual(3);
  });

  it('return ones that has price > 12', async () => {
    const { body } = await request(app)
      .get('/api/ones?price[gt]=12')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.results).toEqual(4);
  });

  it('return ones that has price >= 12', async () => {
    const { body } = await request(app)
      .get('/api/ones?price[gte]=12')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.results).toEqual(5);
  });
});

describe('filter by value', () => {
  it('returns ones has price equal to 11 or 14', async () => {
    const { body } = await request(app)
      .get('/api/ones?price=11,14&sort=price')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.results).toEqual(2);

    expect(body.data[0].price).toEqual(11);
    expect(body.data[1].price).toEqual(14);
  });

  it('returns ones has price equal to 11 or 14 but inputed as hpp polution', async () => {
    const { body } = await request(app)
      .get('/api/ones?price=11&sort=price&price=14')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.results).toEqual(2);

    expect(body.data[0].price).toEqual(11);
    expect(body.data[1].price).toEqual(14);
  });
});

const request = require('supertest');
const { createOne } = require('./utils');
const { app } = require('../../config/app');

let cookie = '';
beforeEach(async () => {
  // const { cookie: newCookie } = await signup({ role: 'admin' });
  // cookie = newCookie;
});

const validData = {};
let invalidData = [[{ test_number: 'dsas', error: 'of wrong data type' }]];

// ==============================================================
invalidData = invalidData.map((item) => [item]);

describe.each(invalidData)('data validation', (invalidData) => {
  it(`shoud fail to create one because ${invalidData.error}`, async () => {
    const response = await request(app)
      .post(`/api/ones`)
      .send({
        ...invalidData,
      })
      .set('Cookie', cookie)
      .expect(400);

    expect(response.body.message).toEqual('Data validation failed');
  });

  it(`should fail to update one because ${invalidData.error}`, async () => {
    const one = await createOne();
    const response = await request(app)
      .put(`/api/ones/${one._id}`)
      .send({
        ...validData,
        ...invalidData,
      })
      .set('Cookie', cookie)
      .expect(400);

    expect(response.body.message).toEqual('Data validation failed');
  });

  it(`shoud fail to update many ones because ${invalidData.error}`, async () => {
    let one1 = await createOne();
    let one2 = await createOne();

    const response = await request(app)
      .put('/api/ones')
      .set('Cookie', cookie)
      .send({
        updateList: [one1._id, one2._id],
        ...validData,
        ...invalidData,
      })
      .expect(400);

    expect(response.body.message).toEqual('Data validation failed');
  });
});

const request = require('supertest');
const { createOne, validOneData } = require('./utils');
const { app } = require('../../config/app');

let cookie = '';
beforeEach(async () => {
  const { cookie: newCookie } = await signup({ role: 'admin' });
  cookie = newCookie;
});

let invalidData = [
  { field: 'test_number', message: 'wrong data type', test_number: 'sss' },
];

// ==============================================================
describe.each(invalidData)(
  'invalid $field',
  ({ field, message, ...invalidData }) => {
    it(`shoud fail to create one because ${message}`, async () => {
      const response = await request(app)
        .post(`/api/ones`)
        .send({
          ...validOneData,
          ...invalidData,
        })
        .set('Cookie', cookie)
        .expect(400);

      expect(response.body.message).toEqual('Data validation failed');
    });

    it(`should fail to update one because ${message}`, async () => {
      const one = await createOne();
      const response = await request(app)
        .put(`/api/ones/${one._id}`)
        .send({
          ...validOneData,
          ...invalidData,
        })
        .set('Cookie', cookie)
        .expect(400);

      expect(response.body.message).toEqual('Data validation failed');
    });

    it(`shoud fail to update many ones because ${message}`, async () => {
      let one1 = await createOne();
      let one2 = await createOne();

      const response = await request(app)
        .put('/api/ones')
        .set('Cookie', cookie)
        .send({
          updateList: [one1._id, one2._id],
          ...validOneData,
          ...invalidData,
        })
        .expect(400);

      expect(response.body.message).toEqual('Data validation failed');
    });
  },
);

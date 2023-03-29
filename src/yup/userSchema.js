const { object, number, string } = require('yup');

const { reqQuery, reqParams, objectIdArray } = require('yup-schemas');

const userSchema = object({
  body: object({
    deleteList: objectIdArray,
    updateList: objectIdArray,
    // for testing only
    test_string: string().max(240),
    test_number: number().min(0).max(9999),
    test_any: string().max(240),
  }),
  params: reqParams,
  query: reqQuery,
});

module.exports = userSchema;

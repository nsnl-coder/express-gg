const { object, number, string } = require('yup');

const { reqQuery, reqParams, objectIdArray } = require('yup-schemas');

const oneSchema = object({
  body: object({
    //
    deleteList: objectIdArray,
    updateList: objectIdArray,
    // for testing only
    test_string: string().max(255).label('test_string'),
    test_number: number().min(0).max(1000).label('test_number'),
    test_any: string().max(255).label('test_any'),
  }),
  params: reqParams,
  query: reqQuery,
});

module.exports = oneSchema;

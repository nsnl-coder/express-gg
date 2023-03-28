const { object, number, string } = require('yup');

const { reqQuery, reqParams, objectIdArray } = require('yup-schemas');

const oneSchema = object({
  body: object({
    name: string().max(240),
    price: number().min(0).max(9999),
    status: string().oneOf(['draft', 'public']),
    //
    deleteList: objectIdArray,
    updateList: objectIdArray,
  }),
  params: reqParams,
  query: reqQuery,
});

module.exports = oneSchema;

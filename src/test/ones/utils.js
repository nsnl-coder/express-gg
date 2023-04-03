const { One } = require('../../models/oneModel');

const validOneData = {
  test_string: 'testname2',
  test_number: 14,
  test_any: 'draft',
};

const createOne = async (data) => {
  const one = await One.create({
    test_string: 'testname',
    test_number: 10,
    test_any: 'draft',
    ...data,
  });

  return JSON.parse(JSON.stringify(one));
};

module.exports = { createOne, validOneData };

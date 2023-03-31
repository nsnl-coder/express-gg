const { One } = require('../../models/oneModel');

// TODO:
// 3. Handle data validation in updateOne, updateManyOnes, createOne (can copy code)
// 4. Handle objectid does not exist in req.body (if has)
// 5. Handle side effect when delete one, or delete many ones

2512;
const createOne = async (data) => {
  const one = await One.create({
    test_string: 'testname',
    test_number: 10,
    test_any: 'draft',
    ...data,
  });

  return JSON.parse(JSON.stringify(one));
};

module.exports = { createOne };

2512;

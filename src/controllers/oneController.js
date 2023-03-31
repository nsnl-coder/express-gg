const { One } = require('../models/oneModel');

const createOne = async (req, res, next) => {
  // TODO: need to parse body
  const body = req.body;
  const one = await One.create(body);
  res.status(201).json({ status: 'success', data: one });
};

const getOne = async (req, res, next) => {
  const one = await One.findById(req.params.id);

  if (!one) {
    return res.status(404).json({
      status: 'success',
      message: 'Can not find one with provided id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: one,
  });
};

const getManyOnes = async (req, res, next) => {
  const {
    fields,
    sort = '-createdAt', // new to old
    page = 1,
    itemsPerPage = 20,
    filter,
  } = req.query;

  // 0. check how many result
  const matchingResults = await One.countDocuments(filter);
  const totalPages = Math.ceil(matchingResults / itemsPerPage);

  if (page > totalPages) {
    return res.status(200).json({
      status: 'success',
      results: 0,
      data: [],
    });
  }

  // 1. create inital query but not await it
  let query = One.find(filter);

  // 2. sorting
  query = query.sort(sort);

  // 3. limit fields
  if (fields) {
    query = query.select(fields);
  }

  // 4. pagination
  const skip = (page - 1) * itemsPerPage;
  const limit = itemsPerPage;

  query = query.skip(skip).limit(limit);

  // 5. finally await query
  const ones = await query;

  res
    .status(200)
    .json({ status: 'success', totalPages, results: ones.length, data: ones });
};

const updateOne = async (req, res, next) => {
  // TODO: need to destruct this body
  const body = req.body;

  const one = await One.findByIdAndUpdate(req.params.id, body, {
    new: true,
    runValidators: true,

  });

  if (!one) {
    return res.status(404).json({
      status: 'fail',
      message: 'Can not find one with provided id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: one,
  });
};

const updateManyOnes = async (req, res, next) => {
  // TODO: need to destruct payload
  const { updateList, ...payload } = req.body;

  // check if ids in updateList all exist
  const matchedDocuments = await One.countDocuments({
    _id: {
      $in: updateList,
    },
  });

  if (matchedDocuments < updateList.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Can not find one with provided ids',
    });
  }

  const { modifiedCount } = await One.updateMany(
    {
      _id: {
        $in: updateList,
      },
    },
    payload,
  );

  res.status(200).json({
    status: 'success',
    modifiedCount,
  });
};

const deleteOne = async (req, res, next) => {
  const id = req.params.id;

  const one = await One.findByIdAndDelete(id);

  if (!one) {
    return res.status(404).json({
      status: 'fail',
      message: 'Cant not find one with provided id',
    });
  }

  res.status(200).json({
    status: 'success',
    messaage: 'you successfully delete your one',
  });
};

const deleteManyOnes = async (req, res, next) => {
  const deleteList = req.body.deleteList;

  const { deletedCount } = await One.deleteMany({
    _id: {
      $in: deleteList,
    },
  });

  if (deletedCount === 0) {
    return res.status(404).json({
      status: 'fail',
      message: 'Can not find ones with provided ids',
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Successfully deleted ones',
    deletedCount,
  });
};

module.exports = {
  createOne,
  getOne,
  getManyOnes,
  updateOne,
  updateManyOnes,
  deleteOne,
  deleteManyOnes,
};

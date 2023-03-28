const { One } = require('../models/oneModel');

const createOne = async (req, res, next) => {
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

const getAllOnes = async (req, res, next) => {
  const {
    fields,
    sort = '-createdAt', // new to old
    page = 1,
    itemsPerPage = 20,
    filter,
  } = req.query;

  // create inital query but not await it
  let query = One.find(filter);

  // sorting
  query = query.sort(sort);
  // limit fields
  if (fields) {
    query = query.select(fields);
  }

  // pagination
  const skip = (page - 1) * itemsPerPage;
  const limit = itemsPerPage;

  query = query.skip(skip).limit(limit);

  const ones = await One.find();
  res.status(200).json({ status: 'success', results: ones.length, data: ones });
};

const updateOne = async (req, res, next) => {
  const body = req.body;

  const one = await One.findByIdAndUpdate(req.params.id, body, {
    new: true,
  });

  if (!one) {
    return res.status(404).json({
      status: 'fail',
      message: 'Cant not find one with provided id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: one,
  });
};

const updateManyOnes = async (req, res, next) => {
  const { updateList, payload } = req.body;

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
      message: 'Cant not find ones with provided ids',
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
  getAllOnes,
  updateOne,
  updateManyOnes,
  deleteOne,
  deleteManyOnes,
};

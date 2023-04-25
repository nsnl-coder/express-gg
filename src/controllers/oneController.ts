import { NextFunction, Request, Response } from 'express';
import { One } from '../models/oneModel';
import { IOne } from '../yup/oneSchema';
import { ReqQuery } from '../types/express';

const createOne = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const one = await One.create(body);
  res.status(201).json({ status: 'success', data: one });
};

const getOne = async (req: Request, res: Response, next: NextFunction) => {
  const one: IOne | null = await One.findById(req.params.id);

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

const getManyOnes = async (req: Request, res: Response, next: NextFunction) => {
  const {
    fields,
    sort = '-createdAt', // new to old
    page = 1,
    itemsPerPage = 10,
    filter,
  } = req.query as ReqQuery;

  // 0. check how many result
  const matchingResults = await One.countDocuments(filter);
  const totalPages = Math.ceil(matchingResults / itemsPerPage);

  const pagination = {
    currentPages: page,
    results: 0,
    totalPages,
    totalResults: matchingResults,
    currentPage: page,
    itemsPerPage,
  };

  if (page > totalPages) {
    return res.status(200).json({
      status: 'success',
      pagination,
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

  res.status(200).json({
    status: 'success',
    data: ones,
    pagination: {
      ...pagination,
      results: ones.length,
    },
  });
};

const updateOne = async (req: Request, res: Response, next: NextFunction) => {
  const one: IOne = req.body;

  const updatedOne = await One.findByIdAndUpdate({ _id: req.params.id }, one, {
    new: true,
    runValidators: true,
  });

  if (!updatedOne) {
    return res.status(404).json({
      status: 'fail',
      message: 'Can not find one with provided id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: updatedOne,
  });
};

const updateManyOnes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { updateList, ...payload } = req.body;

  // TODO: need to destruct one
  const one = payload as IOne;

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
    one,
    {
      runValidators: true,
    },
  );

  res.status(200).json({
    status: 'success',
    data: {
      modifiedCount,
    },
  });
};

const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
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
    message: 'you successfully delete your one',
  });
};

const deleteManyOnes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
    data: {
      deletedCount,
    },
  });
};

export {
  createOne,
  getOne,
  getManyOnes,
  updateOne,
  updateManyOnes,
  deleteOne,
  deleteManyOnes,
};

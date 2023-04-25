import { object, number, string, InferType } from 'yup';
import { reqQuery, reqParams, objectIdArray } from 'yup-schemas';

const reqBody = object({
  //
  deleteList: objectIdArray,
  updateList: objectIdArray,
  // for testing only
  test_string: string().max(255).label('test_string'),
  test_number: number().min(0).max(1000).label('test_number'),
  test_any: string().max(255).label('test_any'),
});

const oneSchema = object({
  body: reqBody,
  params: reqParams,
  query: reqQuery,
});

interface IOne extends InferType<typeof reqBody> {
  _id?: string;
}

export default oneSchema;
export type { IOne };

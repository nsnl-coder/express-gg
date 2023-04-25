import { One } from '../../models/oneModel';
import { IOne } from '../../yup/oneSchema';

const validOneData: Partial<IOne> = {
  test_string: 'testname2',
  test_number: 14,
  test_any: 'draft',
};

const createOne = async (data?: Partial<IOne>): Promise<IOne> => {
  const one = await One.create({
    test_string: 'testname',
    test_number: 10,
    test_any: 'draft',
    ...data,
  });

  return JSON.parse(JSON.stringify(one));
};

export { createOne, validOneData };

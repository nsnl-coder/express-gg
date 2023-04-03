// handle side-effect when delete one or delete many ones
let cookie = '';
beforeEach(async () => {
  const { cookie: newCookie } = await signup({ role: 'admin' });
  cookie = newCookie;
});

describe('handle side effect', () => {
  it.todo('should ... effect when delete one');
  it.todo('should .... effect when delete many ones');
});

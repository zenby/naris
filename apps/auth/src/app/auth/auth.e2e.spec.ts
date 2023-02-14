describe('Auth e2e-test', () => {
  describe('POST /auth/signin', () => {
    it.todo('recive access and refresh token');
    it.todo('get error if pass invalid credentials');
  });
  describe('POST /auth/signup', () => {
    it.todo('user successfully created');
    it.todo('get error if pass invalid data ');
  });
  describe('POST /auth/signout', () => {
    it.todo('refresh token cookie has been deleted');
  });
});

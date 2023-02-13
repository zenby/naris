describe('Auth e2e-test', () => {
  describe('POST /auth/signin', () => {
    describe('if user with such email not exist', () => {
      it.todo('should return 200 status');
      it.todo('response.status should be error');
      it.todo('response.items should contains error what user not exists');
    });

    describe("if sended password don't match exists", () => {
      it.todo('should return 200 status');
      it.todo('response.status should be error');
      it.todo("response.items should contains error what password don't match");
    });
    describe('if all OK', () => {
      it.todo('should return 200 status');
      it.todo('response.status should be OK');
      it.todo('response.items must be empty');
      it.todo('response.headers has Set-Cookie with refresh token');
    });
  });
  describe('POST /auth/signup', () => {
    describe('if user with such email already exists', () => {
      it.todo('should return 200 status');
      it.todo('response.status should be error');
      it.todo('response.items should contains error what user already exists');
    });

    describe('if all ok', () => {
      it.todo('should return 200 status');
      it.todo('response.status should be OK');
      it.todo('response.items must be empty');
      it.todo('response.headers has Set-Cookie with refresh token');

      it.todo('new user must be saved');
    });
  });

  describe('GET /auth/access_token', () => {
    describe('if request contain invalid or empty refresh token in cookies', () => {
      it.todo('should return 401 status');
    });
    describe('if request contains valid refresh token in cookies', () => {
      it.todo('should return 200 status');
      it.todo('response.status should be OK');
      it.todo('response.items must contain access_token as string');
      it.todo('response.headers has Set-Cookie with refresh token');
    });
  });

  describe('POST /auth/signout', () => {
    it.todo("should send fast expired Set-cookie header for refresh token")
  })
});

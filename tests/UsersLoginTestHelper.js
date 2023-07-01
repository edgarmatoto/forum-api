// istanbul ignore file
const UsersLoginTestHelper = {
  async getUserIdAndAccessTokenObject({ server }) {
    // user registration
    const userLogin = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });
    const { id: userId } = JSON.parse(userLogin.payload).data.addedUser;

    // user login
    const userAuth = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });
    const { data: { accessToken } } = JSON.parse(userAuth.payload);

    return {
      userId,
      accessToken,
    };
  },
};

module.exports = UsersLoginTestHelper;

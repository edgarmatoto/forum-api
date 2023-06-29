const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should respond 201 and persisted comment', async () => {
      // Arrange
      const server = await createServer(container);
      // user regist
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

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

      // create thread
      const threadPayload = {
        title: 'thread_title',
        body: 'thread_body',
      };

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: threadPayload,
      });

      const threadId = thread.result.data.addedThread.id;

      const commentPayload = {
        content: 'comment_content',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: commentPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should respond 400 when bad payload', async () => {
      // Arrange
      const server = await createServer(container);

      // user regist
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

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

      // create thread
      const threadPayload = {
        title: 'thread_title',
        body: 'thread_body',
      };

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: threadPayload,
      });

      const threadId = thread.result.data.addedThread.id;

      const commentPayload = {};

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: commentPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBe('gagal membuat comment karena properti yang dibutuhkan tidak ada');
    });

    it('should respond 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container);
      // user regist
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

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

      const commentPayload = {};

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-321/comments',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: commentPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBe('thread tidak ditemukan');
    });

    it('should respond 401 when adding comments with no authentication', async () => {
      // Arrange
      const server = await createServer(container);
      // user regist
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

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

      // create thread
      const threadPayload = {
        title: 'thread_title',
        body: 'thread_body',
      };

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: threadPayload,
      });

      const threadId = thread.result.data.addedThread.id;

      const commentPayload = {
        content: 'comment_content',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: commentPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 401 when request not contain access token', async () => {
      // Arrange
      const server = await createServer(container);
      // user regist
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

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

      // create thread
      const threadPayload = {
        title: 'thread_title',
        body: 'thread_body',
      };

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: threadPayload,
      });

      const threadId = thread.result.data.addedThread.id;

      const commentPayload = {
        content: 'comment_content',
      };

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: commentPayload,
      });

      const commentId = comment.result.data.addedComment.id;

      // action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container);
      // user regist
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

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

      // create thread
      const threadPayload = {
        title: 'thread_title',
        body: 'thread_body',
      };

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: threadPayload,
      });

      const threadId = thread.result.data.addedThread.id;

      const commentPayload = {
        content: 'comment_content',
      };

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: commentPayload,
      });

      const commentId = comment.result.data.addedComment.id;

      // action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/thread-321/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Komentar tidak ditemukan');
    });

    it('should response 403 when user is not owner', async () => {
      // Arrange
      const server = await createServer(container);
      // user regist
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

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

      // user regist2
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding2',
          password: 'secret',
          fullname: 'Dicoding Indonesiaa',
        },
      });

      // user login
      const userAuth2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding2',
          password: 'secret',
        },
      });
      const { accessToken: accessToken2 } = JSON.parse(userAuth2.payload).data;

      // create thread
      const threadPayload = {
        title: 'thread_title',
        body: 'thread_body',
      };

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: threadPayload,
      });

      const threadId = thread.result.data.addedThread.id;

      const commentPayload = {
        content: 'comment_content',
      };

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          Authorization: `Bearer ${accessToken2}`,
        },
        payload: commentPayload,
      });

      const commentId = comment.result.data.addedComment.id;

      // action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('AuthorizationError');
    });

    it('should respond 200 and delete comment', async () => {
      // Arrange
      const server = await createServer(container);
      // user regist
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

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

      // create thread
      const threadPayload = {
        title: 'thread_title',
        body: 'thread_body',
      };

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: threadPayload,
      });

      const threadId = thread.result.data.addedThread.id;

      const commentPayload = {
        content: 'comment_content',
      };

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: commentPayload,
      });

      const commentId = comment.result.data.addedComment.id;

      // action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});

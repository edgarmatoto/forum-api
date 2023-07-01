const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const UsersLoginTestHelper = require('../../../../tests/UsersLoginTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should respond 201 and persisted thread', async () => {
      // Arrange
      const server = await createServer(container);

      const { accessToken } = await UsersLoginTestHelper.getUserIdAndAccessTokenObject({ server });

      const threadPayload = {
        title: 'thread_title',
        body: 'thread_body',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: threadPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should throw error code 400 when bad payload', async () => {
      // Arrange
      const server = await createServer(container);

      const { accessToken } = await UsersLoginTestHelper.getUserIdAndAccessTokenObject({ server });

      const threadPayload = {
        body: 'thread_body',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: threadPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBe('gagal membuat thread karena properti yang dibutuhkan tidak ada');
    });

    it('should throw error code 401 when adding thread with no authentication', async () => {
      // Arrange
      const server = await createServer(container);

      const threadPayload = {
        title: 'thread_title',
        body: 'thread_body',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toBe('Missing authentication');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should respond 200 and detail thread correctly', async () => {
      // Arrange
      const server = await createServer(container);

      const { userId } = await UsersLoginTestHelper.getUserIdAndAccessTokenObject({ server });

      const threadId = 'thread-123';
      await ThreadsTableTestHelper.addThread({ owner: userId });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
    });

    it('should respond 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-1',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });
});

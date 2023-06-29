const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ username: 'dicoding' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('add thread to database', () => {
    it('should persist add thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'thread_title',
        body: 'thread_body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const threadInDatabase = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(threadInDatabase).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'thread_title',
        body: 'thread_body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const thread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(thread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: newThread.title,
        owner: newThread.owner,
      }));
    });
  });

  describe('get detail thread from database', () => {
    it('should get detail thread correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123', title: 'thread_title', body: 'thread_body', owner: 'user-123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getDetailThreadById('thread-123');

      // Assert
      expect(thread).toHaveProperty('id', 'thread-123');
      expect(thread).toHaveProperty('title', 'thread_title');
      expect(thread).toHaveProperty('body', 'thread_body');
      expect(thread).toHaveProperty('username', 'dicoding');
    });

    it('should return NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      // Assert
      await expect(threadRepositoryPostgres.getDetailThreadById('thread-123')).rejects.toThrow(NotFoundError);
    });
  });

  describe('verifyThreadExistence', () => {
    it('should throw NotFoundError when thread not exist', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      // Assert
      await expect(threadRepositoryPostgres.verifyThreadExistence('thread-123')).rejects.toThrow(NotFoundError);
    });

    it('should not throw NotFoundError when thread exist', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      // Assert
      await expect(threadRepositoryPostgres.verifyThreadExistence('thread-123')).resolves.not.toThrow(NotFoundError);
    });
  });
});

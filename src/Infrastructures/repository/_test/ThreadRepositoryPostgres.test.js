const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('ThreadRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
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

  // describe('get detail thread from database', () => {

  // });
});

const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('add comment to database', () => {
    it('should persist add comment correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const newComment = new NewComment({
        content: 'comment_content',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      // stub idGenerator
      const idGenerator = () => '123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, idGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const commentInDatabase = await CommentsTableTestHelper.findCommentById(addedComment.id);
      expect(commentInDatabase).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      const newComment = new NewComment({
        content: 'comment_content',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      // stub idGenerator
      const idGenerator = () => '123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, idGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: newComment.content,
        owner: newComment.owner,
      }));
    });
  });
});

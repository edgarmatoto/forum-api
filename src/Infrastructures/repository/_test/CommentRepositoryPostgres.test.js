const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ username: 'dicoding' });
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

  describe('deleteCommentById function', () => {
    it('should persist delete comment correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
      const commentId = 'comment-123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteCommentById(commentId);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById(commentId);
      expect(comment[0].is_delete).toBe(true);
    });

    it('should throw NotFoundError when comment not exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      // Assert
      await expect(commentRepositoryPostgres.deleteCommentById('comment-123')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getCommentByThreadId function', () => {
    it('should return comment by thread id correctly', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({});

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const result = await commentRepositoryPostgres.getCommentByThreadId('thread-123');

      // Assert
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id', 'comment-123');
      expect(result[0]).toHaveProperty('content', 'comment_content');
      expect(result[0]).toHaveProperty('thread_id', 'thread-123');
      expect(result[0]).toHaveProperty('owner', 'user-123');
      expect(result[0]).toHaveProperty('username', 'dicoding');
      expect(result[0]).toHaveProperty('is_delete', false);
    });
  });

  describe('verifyCommentOwner', () => {
    it('should return AuthorizationError when comment owner is not the real owner', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      // Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-321')).rejects.toThrow(AuthorizationError);
    });

    it('should not return AuthorizationError when comment owner is the real owner', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      // Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('verifyCommentExistenceInThread', () => {
    it('should return NotFoundError when comment in thread is not exist', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-321' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      // Assert
      await expect(commentRepositoryPostgres.verifyCommentExistenceInThread('comment-123', 'thread-321')).rejects.toThrow(NotFoundError);
    });

    it('should not return NotFoundError when comment in thread is exist', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      // Assert
      await expect(commentRepositoryPostgres.verifyCommentExistenceInThread('comment-123', 'thread-123')).resolves.not.toThrow(NotFoundError);
    });
  });
});

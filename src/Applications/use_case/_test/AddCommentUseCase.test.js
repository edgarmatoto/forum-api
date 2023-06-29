const CommentRepository = require('../../../Domains/comments/CommentRepository');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const AddCommentUseCase = require('../AddCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('AddCommentUseCase', () => {
  it('should orchestrating add comment action correctly', async () => {
    // Arrange
    const commentUseCasePayload = {
      content: 'comment_content',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    const expectedAddedComment = new AddedComment({
      content: commentUseCasePayload.content,
      id: 'comment-123',
      owner: commentUseCasePayload.owner,
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedComment({
        content: commentUseCasePayload.content,
        id: 'comment-123',
        owner: commentUseCasePayload.owner,
      })));

    mockThreadRepository.verifyThreadExistence = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(commentUseCasePayload);

    // Assert
    expect(addedComment).toStrictEqual(expectedAddedComment);
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment(commentUseCasePayload));
    expect(mockThreadRepository.verifyThreadExistence).toBeCalledWith(commentUseCasePayload.threadId);
  });

  it('should throw error when thread not exist', async () => {
    // Arrange
    const useCasePayload = {
      owner: 'user-123',
      threadId: 'thread-123',
      content: 'comment_content',
    };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExistence = jest.fn()
      .mockImplementation(() => Promise.reject(new NotFoundError()));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    await expect(addCommentUseCase.execute(useCasePayload)).rejects.toThrow(NotFoundError);
    expect(mockThreadRepository.verifyThreadExistence).toBeCalledWith(useCasePayload.threadId);
  });
});

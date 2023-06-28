const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating get detail thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';

    const detailThread = new DetailThread({
      title: 'thread-title',
      id: 'thread-123',
      date: '2023',
      body: 'thread_body',
      username: 'user',
    });

    let detailComment = [
      new DetailComment({
        id: 'comment-123',
        username: 'user',
        date: '2023',
        content: 'comment_content',
        is_delete: false,
      }),
    ];

    detailComment = detailComment.map(({ is_delete: boolean, ...otherProperties }) => otherProperties);

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        new DetailComment({
          id: 'comment-123',
          username: 'user',
          date: '2023',
          content: 'comment_content',
          is_delete: false,
        }),
      ]));

    mockThreadRepository.getDetailThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(new DetailThread({
        title: 'thread-title',
        id: 'thread-123',
        date: '2023',
        body: 'thread_body',
        username: 'user',
      })));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadAndComments = await getDetailThreadUseCase.execute({ threadId });

    // Assert
    expect(threadAndComments).toEqual({ ...detailThread, comments: detailComment });
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(threadId);
    expect(mockThreadRepository.getDetailThreadById).toBeCalledWith(threadId);
  });

  it('should not display comments when deleted', async () => {
    // Arrange
    const threadId = 'thread-123';

    const detailThread = new DetailThread({
      title: 'thread-title',
      id: 'thread-123',
      date: '2023',
      body: 'thread_body',
      username: 'user',
    });

    let detailComment = [
      new DetailComment({
        id: 'comment-123',
        username: 'user',
        date: '2023',
        content: '**komentar telah dihapus**',
        is_delete: true,
      }),
    ];

    detailComment = detailComment.map(({ is_delete: boolean, ...otherProperties }) => otherProperties);

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.getCommentByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        new DetailComment({
          id: 'comment-123',
          username: 'user',
          date: '2023',
          content: '**komentar telah dihapus**',
          is_delete: true,
        }),
      ]));

    mockThreadRepository.getDetailThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(new DetailThread({
        title: 'thread-title',
        id: 'thread-123',
        date: '2023',
        body: 'thread_body',
        username: 'user',
      })));

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadAndComments = await getDetailThreadUseCase.execute({ threadId });

    // Assert
    expect(threadAndComments).toEqual({ ...detailThread, comments: detailComment });
    expect(mockCommentRepository.getCommentByThreadId).toBeCalledWith(threadId);
    expect(mockThreadRepository.getDetailThreadById).toBeCalledWith(threadId);
  });
});

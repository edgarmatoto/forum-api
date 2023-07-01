const ReplyRepository = require('../../../../Domains/replies/ReplyRepository');
const NewReply = require('../../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../../Domains/replies/entities/AddedReply');
const AddReplyUseCase = require('../AddReplyUseCase');
const CommentRepository = require('../../../../Domains/comments/CommentRepository');

describe('AddReplyUseCase', () => {
  it('should orchestrating add reply action correctly', async () => {
    // Arrange
    const replyUseCasePayload = {
      content: 'comment_content',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const expectedAddedReply = new AddedReply({
      content: replyUseCasePayload.content,
      id: 'reply-123',
      owner: replyUseCasePayload.owner,
    });

    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();

    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(new AddedReply({
        content: replyUseCasePayload.content,
        id: 'reply-123',
        owner: replyUseCasePayload.owner,
      })));

    mockCommentRepository.verifyCommentExistence = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(replyUseCasePayload);

    // Assert
    expect(addedReply).toStrictEqual(expectedAddedReply);
    expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply(replyUseCasePayload));
    expect(mockCommentRepository.verifyCommentExistence).toBeCalledWith(replyUseCasePayload.commentId);
  });
});

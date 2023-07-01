const NewReply = require('../NewReply');

describe('NewReply entities', () => {
  it('should create NewReply object correctly', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      content: 'reply_content',
      owner: 'user-123',
    };

    // Action
    const newReply = new NewReply(payload);

    // Assert
    expect(newReply.commentId).toBe(payload.commentId);
    expect(newReply.content).toBe(payload.content);
    expect(newReply.owner).toBe(payload.owner);
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
      content: 'reply_content',
    };

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload has forbidden data type', () => {
    // Arrange
    const payload = {
      commentId: {},
      content: 'reply_content',
      owner: true,
    };

    // Action and Assert
    expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});

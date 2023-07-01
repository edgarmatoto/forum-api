const AddedReply = require('../AddedReply');

describe('AddedReply entities', () => {
  it('should create AddedReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'reply_content',
      owner: 'user-123',
    };

    // Action
    const addedReply = new AddedReply(payload);

    // Assert
    expect(addedReply.id).toBe(payload.id);
    expect(addedReply.content).toBe(payload.content);
    expect(addedReply.owner).toBe(payload.owner);
  });

  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'reply_content',
    };

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload has forbidden data type', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: {},
      owner: true,
    };

    // Action and Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});

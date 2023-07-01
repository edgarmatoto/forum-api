const DetailReply = require('../DetailReply');

describe('DetailReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      date: '2023',
      content: 'comment_content',
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload has forbidden data type', () => {
    // Arrange
    const payload = {
      id: {},
      username: true,
      date: '2023',
      content: 'comment_content',
      is_delete: 1,
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'atan',
      date: '2023',
      content: 'comment_content',
      is_delete: false,
    };

    // Action
    const detailReply = new DetailReply(payload);

    // Assert
    expect(detailReply.id).toEqual(payload.id);
    expect(detailReply.username).toEqual(payload.username);
    expect(detailReply.date).toEqual(payload.date);
    expect(detailReply.content).toEqual(payload.content);
    expect(detailReply.is_delete).toEqual(payload.is_delete);
  });
});

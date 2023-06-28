const DetailComment = require('../DetailComment');

describe('DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      date: '2023',
      content: 'comment_content',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
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
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'atan',
      date: '2023',
      content: 'comment_content',
      is_delete: false,
    };

    // Action
    const detailComment = new DetailComment(payload);

    // Assert
    expect(detailComment.id).toEqual(payload.id);
    expect(detailComment.username).toEqual(payload.username);
    expect(detailComment.date).toEqual(payload.date);
    expect(detailComment.content).toEqual(payload.content);
    expect(detailComment.is_delete).toEqual(payload.is_delete);
  });
});

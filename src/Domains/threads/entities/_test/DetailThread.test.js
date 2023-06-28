const DetailThread = require('../DetailThread');

describe('DetailThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'thread_title',
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload has forbidden data type', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'thread_title',
      body: 'thread_body',
      date: '2023',
      username: true,
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'thread_title',
      body: 'thread_body',
      date: '2023',
      username: 'atan menjadi setan',
    };

    // Action
    const detailThread = new DetailThread(payload);

    // Assert
    expect(detailThread.title).toEqual(payload.title);
    expect(detailThread.body).toEqual(payload.body);
    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.date).toEqual(payload.date);
    expect(detailThread.username).toEqual(payload.username);
  });
});

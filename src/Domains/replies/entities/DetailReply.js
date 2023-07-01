class DetailReply {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      content, id, date, username, is_delete,
    } = payload;
    this.id = id;
    this.username = username;
    this.date = date;
    this.content = content;
    this.is_delete = is_delete;
  }

  _verifyPayload({
    id, date, username, content, is_delete,
  }) {
    if (!id || !date || !username || !content || is_delete === undefined) {
      throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof date !== 'string' || typeof username !== 'string' || typeof content !== 'string' || typeof is_delete !== 'boolean') {
      throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailReply;

class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const thread = await this._threadRepository.getDetailThreadById(threadId);
    let comments = await this._commentRepository.getCommentByThreadId(threadId);

    comments = comments.map((comment) => ({
      id: comment.id,
      username: comment.username,
      date: comment.date,
      content: comment.is_delete
        ? '**komentar telah dihapus**'
        : comment.content,
    }));

    return {
      ...thread,
      comments,
    };
  }
}

module.exports = GetDetailThreadUseCase;

const NewReply = require('../../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    await this._commentRepository.verifyCommentExistence(useCasePayload.commentId);
    const { content, commentId, owner } = useCasePayload;
    const newReply = new NewReply({
      content,
      commentId,
      owner,
    });
    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;

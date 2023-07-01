class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { replyId, commentId, owner } = useCasePayload;
    await this._replyRepository.verifyReplyExistenceInComment(replyId, commentId);
    await this._replyRepository.verifyReplyOwner(
      replyId,
      owner,
    );
    await this._replyRepository.deleteReplyById(replyId);
  }
}

module.exports = DeleteReplyUseCase;

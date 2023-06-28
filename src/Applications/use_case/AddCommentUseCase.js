const NewComment = require('../../Domains/comments/entities/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._verifyThreadExistence(useCasePayload);
    const { content, threadId, owner } = useCasePayload;
    const newComment = new NewComment({
      content,
      threadId,
      owner,
    });
    return this._commentRepository.addComment(newComment);
  }

  async _verifyThreadExistence(payload) {
    const { threadId } = payload;
    try {
      await this._threadRepository.verifyThreadExistence(threadId);
    } catch (error) {
      throw new Error('ADD_COMMENT_USE_CASE.THREAD_NOT_FOUND');
    }
  }
}

module.exports = AddCommentUseCase;

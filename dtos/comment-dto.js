module.exports = class CommentDto {
    id;
    postId;
    userId;
    text;

    constructor(model) {
        this.id = model.id;
        this.postId = model.postId;
        this.userId = model.userId;
        this.text = model.text;
    }
}